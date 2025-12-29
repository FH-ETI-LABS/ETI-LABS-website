/**
 * CameraCard.tsx
 * ----------------
 * Simplified live camera component for Foothill ETI Labs.
 * Displays a continuous video feed (no play/pause) with only a fullscreen control.
 */

import { useRef } from "react";
import "./CameraCard.css";

type CameraCardProps = {
  /** Unique element ID for the camera */
  id: string;
  /** Label displayed under the camera (e.g., "Camera 1") */
  title: string;
  /** Optional video source (MP4, live stream, etc.) */
  src?: string;
  /** Optional fallback image */
  poster?: string;
};

const CameraCard = ({ id, title, src, poster }: CameraCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /*
   * Expands the camera card to fullscreen using the browser’s Fullscreen API.
   * - Wrapped in a try/catch to silently handle permission or browser errors.
   */
  const handleFullScreen = async () => {
    const el = videoRef.current ?? document.getElementById(id);
    if (!el) return;

    const wrapper = el.closest(".camera-card") as HTMLElement | null;
    const target = wrapper ?? el;

    try {
      if (target.requestFullscreen) await target.requestFullscreen();
      else if ((target as any).webkitRequestFullscreen)
        (target as any).webkitRequestFullscreen();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="camera-card" role="region" aria-label={title}>
      <div className="camera-frame">
        {src ? (
          <video
            id={id}
            ref={videoRef}
            className="camera-video"
            src={src}
            poster={poster}
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div id={id} className="camera-placeholder" aria-hidden="true">
            <div className="camera-rec">
              <span className="rec-dot" /> LIVE
            </div>
            <div className="placeholder-graphic" />
          </div>
        )}
      </div>

      <div className="camera-title">{title}</div>

      <div
  className="camera-controls"
  role="toolbar"
  aria-label={`${title} controls`}
>
        <button className="control-btn" onClick={handleFullScreen}>
          ⤢ Fullscreen
        </button>
      </div>
    </div>
  );
};

export default CameraCard;
