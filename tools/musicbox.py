"""
Renders the invitation's background music: an original music-box lullaby.

Written rather than licensed. A family invitation that gets shared around should not
carry someone else's track with someone else's terms attached, and a music box is the
one instrument this artwork already sounds like.

Output is a seamless loop: the reverb tail that runs past the end is folded back over
the beginning, so the join is inaudible.
"""
import math
import struct
import wave

SR = 44100
BPM = 76.0
BEAT = 60.0 / BPM
BAR = BEAT * 3  # three beats to the bar, a slow waltz

# F major pentatonic. Midi numbers.
# Each bar: the bass root, the three chord tones the arpeggio walks, and the melody
# notes keyed by which beat they land on.
BARS = [
    (41, [65, 69, 72], {0: 77}),           # F
    (38, [62, 65, 69], {0: 81, 2: 79}),    # Dm
    (34, [58, 62, 65], {0: 77, 2: 74}),    # Bb
    (36, [60, 64, 67], {0: 76}),           # C
    (41, [65, 69, 72], {0: 77, 2: 84}),    # F
    (38, [62, 65, 69], {0: 81, 2: 77}),    # Dm
    (31, [55, 58, 62], {0: 79, 2: 74}),    # Gm
    (36, [60, 64, 67], {0: 72}),           # C
    (41, [65, 69, 72], {0: 84}),           # F, the melody an octave up
    (38, [62, 65, 69], {0: 86, 2: 84}),    # Dm
    (34, [58, 62, 65], {0: 81, 2: 77}),    # Bb
    (36, [60, 64, 67], {0: 79}),           # C
    (41, [65, 69, 72], {0: 84, 2: 81}),    # F
    (38, [62, 65, 69], {0: 77}),           # Dm
    (31, [55, 58, 62], {0: 74, 2: 72}),    # Gm
    (36, [60, 64, 67], {0: 77}),           # C, turning back to the top
]

# Which chord tone each of the bar's six eighth notes plays: up and back down.
ARPEGGIO = [0, 1, 2, 2, 1, 0]

TAIL = 2.6  # seconds of ring allowed to run past the end, then folded back


def freq(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def strike(buf: list, at: float, midi: int, gain: float, tau: float) -> None:
    """
    One music-box note. The partials above the fundamental are deliberately not whole
    multiples of it — a tine is a bar of metal, not a string, and the slight inharmonicity
    is most of what makes the sound read as a music box rather than as a sine.
    """
    partials = ((1.0, 1.0, 1.0), (2.0, 0.40, 0.62), (3.02, 0.17, 0.45), (4.21, 0.085, 0.34), (5.43, 0.045, 0.28))
    f0 = freq(midi)
    start = int(at * SR)
    length = int(min(tau * 4.5, 6.0) * SR)
    if start + length > len(buf):
        length = len(buf) - start
    attack = int(0.004 * SR)
    for partial, amp, decay_scale in partials:
        f = f0 * partial
        if f > SR * 0.45:
            continue
        w = 2.0 * math.pi * f / SR
        t_decay = tau * decay_scale
        k = -1.0 / (t_decay * SR)
        a = amp * gain
        for i in range(length):
            env = math.exp(k * i)
            if env < 0.0004:
                break
            if i < attack:
                env *= i / attack
            buf[start + i] += a * env * math.sin(w * i)


def pad(buf: list, at: float, midi: int, gain: float, dur: float) -> None:
    """A soft low sine under each bar. Not heard on its own; without it the box is thin."""
    f = freq(midi)
    w = 2.0 * math.pi * f / SR
    start = int(at * SR)
    length = int(min(dur * 1.6, len(buf) / SR - at) * SR)
    rise = int(0.22 * SR)
    for i in range(length):
        env = math.exp(-2.0 * i / (dur * SR))
        if i < rise:
            env *= i / rise
        buf[start + i] += gain * env * math.sin(w * i)


def comb(buf: list, delay: int, feedback: float, mix: float) -> None:
    """One comb filter, in place. Several of these at coprime delays make a soft room."""
    for i in range(delay, len(buf)):
        buf[i] += buf[i - delay] * feedback * mix


def main() -> None:
    piece = len(BARS) * BAR
    total = piece + TAIL
    buf = [0.0] * int(total * SR)

    for index, (bass, tones, melody) in enumerate(BARS):
        t0 = index * BAR
        pad(buf, t0, bass, 0.085, BAR)
        for step, tone_index in enumerate(ARPEGGIO):
            at = t0 + step * (BEAT / 2.0)
            # The first note of the bar leans slightly, the way a hand would.
            gain = 0.20 if step == 0 else 0.135
            strike(buf, at, tones[tone_index], gain, 0.62)
        for beat, note in melody.items():
            strike(buf, t0 + beat * BEAT, note, 0.34, 1.15)

    # A small hall. Coprime delays so the repeats never stack into a flutter.
    for delay, feedback in ((1327, 0.34), (1873, 0.27), (2549, 0.21), (3571, 0.16)):
        comb(buf, delay, feedback, 1.0)

    # Fold the ring-out back over the opening so the loop joins without a seam.
    piece_samples = int(piece * SR)
    for i in range(len(buf) - piece_samples):
        buf[i] += buf[piece_samples + i]
    buf = buf[:piece_samples]

    peak = max(abs(v) for v in buf) or 1.0
    scale = 0.72 / peak

    # A touch of width: the right channel is a few samples late and a hair quieter.
    offset = 9
    frames = bytearray()
    for i in range(len(buf)):
        left = buf[i] * scale
        right = buf[i - offset] * scale * 0.94 if i >= offset else 0.0
        frames += struct.pack("<hh", int(max(-1.0, min(1.0, left)) * 32000),
                              int(max(-1.0, min(1.0, right)) * 32000))

    out = "lullaby.wav"
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))
    print(f"{out}  {piece:.1f}s  peak {peak:.3f}")


if __name__ == "__main__":
    main()
