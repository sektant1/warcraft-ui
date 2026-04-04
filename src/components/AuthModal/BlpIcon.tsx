import { useEffect, useState } from "react";
import { loadBlpDataUrl } from "../../utils/glueButton";

interface BlpIconProps {
  /** Full path relative to /public, e.g. "./buttons/command/BTNFootman.blp" */
  path: string;
  size?: number;
  className?: string;
  alt?: string;
  title?: string;
}

export default function BlpIcon({
  path,
  size = 32,
  className = "",
  alt = "",
  title,
}: BlpIconProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    void loadBlpDataUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!url) {
    return (
      <span
        className={`blp-icon-placeholder ${className}`}
        style={{ width: size, height: size, display: "inline-block" }}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      title={title}
      className={`blp-icon ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
