/**
 * Plays one of the Higgsfield cinematic clips, with a fallback chain that never leaves
 * a guest looking at a loading screen:
 *
 *   generated video  ->  generated poster/hero still  ->  painted kingdom
 *
 * The clip is muted, inline and loops, so it behaves on iOS. If it errors, stalls, or
 * simply has not been generated yet, `onUnavailable` fires and the caller shows the
 * still layer instead. The still is rendered underneath from the start, so there is
 * never a blank frame between the two.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { VIDEO_SOURCES, type VideoId } from "../lib/assets";
import "./CinematicVideo.css";

interface Props {
  readonly id: VideoId;
  /** Painted underneath the video and left showing if it cannot play. */
  readonly fallback: ReactNode;
  readonly className?: string;
  /** Only the clip the guest sees first should preload. */
  readonly preload?: "auto" | "metadata" | "none";
  readonly loop?: boolean;
  readonly onEnded?: () => void;
  /** Fired once when we know the clip will not play. */
  readonly onUnavailable?: () => void;
}

/** How long to wait for a first frame before giving up and showing the still. */
const STALL_TIMEOUT_MS = 4000;

export function CinematicVideo({
  id,
  fallback,
  className,
  preload = "metadata",
  loop = true,
  onEnded,
  onUnavailable,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playable, setPlayable] = useState(false);
  const [failed, setFailed] = useState(false);
  const sources = VIDEO_SOURCES[id];

  useEffect(() => {
    if (failed || playable) return;

    // A clip that never produces a frame is as bad as one that errors, so treat a
    // stall as unavailable rather than waiting indefinitely.
    const timer = window.setTimeout(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        setFailed(true);
        onUnavailable?.();
      }
    }, STALL_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [failed, playable, onUnavailable]);

  function handleFailure() {
    if (failed) return;
    setFailed(true);
    onUnavailable?.();
  }

  return (
    <div className={`cinematic${className ? ` ${className}` : ""}`}>
      <div className="cinematic__fallback">{fallback}</div>

      {!failed && (
        <video
          ref={videoRef}
          className={`cinematic__video${playable ? " is-playing" : ""}`}
          muted
          playsInline
          autoPlay
          loop={loop}
          preload={preload}
          poster={sources.poster}
          onCanPlay={() => setPlayable(true)}
          onError={handleFailure}
          onStalled={handleFailure}
          onEnded={onEnded}
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
