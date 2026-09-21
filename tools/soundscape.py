"""
Renders the rest of the invitation's sound: two more music beds and four short effects.

Everything here is written from scratch for this page, like `musicbox.py` before it, and
for the same reason — an invitation that gets forwarded around should not carry anyone
else's soundtrack or anyone else's licence. No melody, motif or sound in this file is
taken from a film, a game or a record.

The three beds share one key (F major) and one tempo, so the engine can cross-fade
between them at any moment without the two ever disagreeing about what note they are on.

Every bed is a seamless loop, by construction rather than by editing:
  - sustained voices use frequencies rounded to a whole number of cycles per loop, so
    they arrive back at the start of their own waveform exactly at the join;
  - struck notes are allowed to ring past the end, and the overhang is folded back over
    the opening, so the decay of the last note is what you hear under the first.
"""
import math
import struct
import sys
import wave

SR = 44100


def freq(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def snap(f: float, loop: float) -> float:
    """The nearest frequency that completes a whole number of cycles in one loop."""
    cycles = max(1, round(f * loop))
    return cycles / loop


def drone(buf: list, midi: float, gain: float, loop: float, lfo_cycles: int, partials=(1.0, 2.0, 3.0)) -> None:
    """
    One sustained voice, breathing.

    The breath is an LFO with a whole number of cycles per loop, for the same reason the
    pitch is snapped: anything that does not come back to where it started is a click.
    """
    amps = (1.0, 0.26, 0.11)
    for partial, amp in zip(partials, amps):
        f = snap(freq(midi) * partial, loop)
        if f > SR * 0.45:
            continue
        w = 2.0 * math.pi * f / SR
        lfo = 2.0 * math.pi * lfo_cycles / (loop * SR)
        a = gain * amp
        for i in range(len(buf)):
            breath = 0.72 + 0.28 * math.sin(lfo * i)
            buf[i] += a * breath * math.sin(w * i)


def strike(buf: list, at: float, midi: float, gain: float, tau: float, bright: float = 1.0) -> None:
    """A struck bell. Inharmonic partials, exponential decay — a tine, not a string."""
    partials = ((1.0, 1.0, 1.0), (2.0, 0.38 * bright, 0.62), (3.02, 0.16 * bright, 0.45),
                (4.21, 0.08 * bright, 0.34), (5.43, 0.042 * bright, 0.28))
    f0 = freq(midi)
    start = int(at * SR)
    if start >= len(buf):
        return
    length = min(int(min(tau * 4.5, 6.0) * SR), len(buf) - start)
    attack = max(1, int(0.004 * SR))
    for partial, amp, decay_scale in partials:
        f = f0 * partial
        if f > SR * 0.45:
            continue
        w = 2.0 * math.pi * f / SR
        k = -1.0 / (tau * decay_scale * SR)
        a = amp * gain
        for i in range(length):
            env = math.exp(k * i)
            if env < 0.0004:
                break
            if i < attack:
                env *= i / attack
            buf[start + i] += a * env * math.sin(w * i)


def noise_swell(buf: list, at: float, dur: float, gain: float, centre: float) -> None:
    """
    A breath of air, for the transitions.

    A one-pole band-pass over a cheap deterministic noise source. Deterministic because a
    build that produces a different file every time is a build nobody can check.
    """
    start = int(at * SR)
    length = min(int(dur * SR), len(buf) - start)
    if length <= 0:
        return
    state = 123456789
    low = 0.0
    high = 0.0
    k = 2.0 * math.pi * centre / SR
    for i in range(length):
        state = (state * 1103515245 + 12345) & 0x7FFFFFFF
        white = (state / 0x3FFFFFFF) - 1.0
        low += k * (white - low)
        high = white - low
        # A slow rise and a longer fall, so it arrives rather than appears.
        x = i / length
        env = math.sin(math.pi * x) ** 1.6
        buf[start + i] += gain * env * (low * 0.7 + high * 0.3)


def comb(buf: list, delay: int, feedback: float) -> None:
    for i in range(delay, len(buf)):
        buf[i] += buf[i - delay] * feedback


def reverb(buf: list) -> None:
    for delay, feedback in ((1327, 0.34), (1873, 0.27), (2549, 0.21), (3571, 0.16)):
        comb(buf, delay, feedback)


def write(name: str, buf: list, peak_to: float = 0.72, width: int = 9) -> None:
    peak = max(abs(v) for v in buf) or 1.0
    scale = peak_to / peak
    frames = bytearray()
    for i in range(len(buf)):
        left = buf[i] * scale
        right = buf[i - width] * scale * 0.94 if i >= width else 0.0
        frames += struct.pack("<hh", int(max(-1.0, min(1.0, left)) * 32000),
                              int(max(-1.0, min(1.0, right)) * 32000))
    with wave.open(name, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))
    print(f"{name}  {len(buf) / SR:.1f}s  peak {peak:.3f}")


def fold(buf: list, loop: float) -> list:
    """Fold whatever rang past the loop point back over the opening, then cut."""
    n = int(loop * SR)
    for i in range(min(n, len(buf) - n)):
        buf[i] += buf[n + i]
    return buf[:n]


# ---------------------------------------------------------------- the beds

def sky() -> None:
    """
    The air of the cloud kingdom, and of the sunset at the end.

    Almost no melody: three sustained voices a fifth apart and a handful of high bells
    that fall at intervals long enough that you never learn when to expect one. This
    plays where the guest is meant to be looking rather than listening.
    """
    loop = 24.0
    tail = 4.0
    buf = [0.0] * int((loop + tail) * SR)

    # F2, C3, F3, A3 — the chord held open, no third in the bass.
    for midi, gain, cycles in ((29, 0.085, 1), (36, 0.07, 2), (41, 0.055, 3), (45, 0.03, 2)):
        drone(buf, midi, gain, loop, cycles)

    # High bells, at times that do not divide the loop evenly.
    for at, midi in ((1.4, 84), (6.1, 89), (10.7, 86), (15.2, 91), (19.6, 84), (22.3, 88)):
        strike(buf, at, midi, 0.20, 1.6, bright=0.7)

    reverb(buf)
    write("sky-ambience.wav", fold(buf, loop), peak_to=0.62)


def shimmer() -> None:
    """
    The brighter bed, for the moment the year adds up and for the invitation itself.

    Same key and same waltz as the lullaby, but the box is playing up an octave and there
    is a light pulse on every beat, so crossing into it feels like the lights coming on
    rather than like a different piece of music starting.
    """
    bpm = 76.0
    beat = 60.0 / bpm
    bar = beat * 3
    bars = [
        (41, [77, 81, 84], {0: 89}),
        (38, [74, 77, 81], {0: 93, 2: 91}),
        (34, [70, 74, 77], {0: 89, 2: 86}),
        (36, [72, 76, 79], {0: 88}),
        (41, [77, 81, 84], {0: 89, 2: 96}),
        (38, [74, 77, 81], {0: 93, 2: 89}),
        (31, [67, 70, 74], {0: 91, 2: 86}),
        (36, [72, 76, 79], {0: 84}),
    ]
    arpeggio = [0, 1, 2, 2, 1, 0]
    loop = len(bars) * bar
    tail = 3.0
    buf = [0.0] * int((loop + tail) * SR)

    for midi, gain, cycles in ((41, 0.055, 2), (48, 0.035, 3)):
        drone(buf, midi, gain, loop, cycles)

    for index, (_bass, tones, melody) in enumerate(bars):
        t0 = index * bar
        for step, tone in enumerate(arpeggio):
            strike(buf, t0 + step * (beat / 2.0), tones[tone],
                   0.13 if step else 0.185, 0.5, bright=1.25)
        for at_beat, note in melody.items():
            strike(buf, t0 + at_beat * beat, note, 0.28, 0.95, bright=1.35)

    reverb(buf)
    write("shimmer.wav", fold(buf, loop))


# ---------------------------------------------------------------- the effects

def enter() -> None:
    """The door opening: five notes up the pentatonic, and a breath of air under them."""
    buf = [0.0] * int(2.8 * SR)
    for index, midi in enumerate((77, 81, 84, 89, 93)):
        strike(buf, 0.04 * index, midi, 0.30 - index * 0.02, 1.5, bright=1.2)
    noise_swell(buf, 0.0, 1.4, 0.05, 2600.0)
    reverb(buf)
    write("sfx-enter.wav", buf, peak_to=0.8)


def chime() -> None:
    """One bell, for arriving somewhere. Deliberately plain: it is punctuation."""
    buf = [0.0] * int(2.4 * SR)
    strike(buf, 0.0, 84, 0.34, 1.5)
    strike(buf, 0.012, 91, 0.10, 1.1, bright=0.8)
    reverb(buf)
    write("sfx-chime.wav", buf, peak_to=0.72)


def sparkle() -> None:
    """A small scatter of very high notes. Used where something appears."""
    buf = [0.0] * int(1.8 * SR)
    for at, midi, gain in ((0.0, 96, 0.16), (0.07, 101, 0.12), (0.15, 93, 0.11), (0.26, 98, 0.08)):
        strike(buf, at, midi, gain, 0.7, bright=0.6)
    reverb(buf)
    write("sfx-sparkle.wav", buf, peak_to=0.6)


def bloom() -> None:
    """The reply landing: a warm open chord that settles rather than rings."""
    buf = [0.0] * int(3.2 * SR)
    for index, midi in enumerate((65, 69, 72, 77)):
        strike(buf, 0.03 * index, midi, 0.24, 1.8, bright=0.75)
    noise_swell(buf, 0.0, 1.0, 0.03, 1400.0)
    reverb(buf)
    write("sfx-bloom.wav", buf, peak_to=0.78)


PIECES = {
    "sky": sky,
    "shimmer": shimmer,
    "enter": enter,
    "chime": chime,
    "sparkle": sparkle,
    "bloom": bloom,
}


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(PIECES)
    for name in wanted:
        PIECES[name]()
