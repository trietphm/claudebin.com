"use client";

import type { HTMLAttributes } from "react";
import Image from "next/image";
import { useRef } from "react";
import { useBoolean } from "usehooks-ts";

import { cn } from "@/utils/helpers";

import { SvgIconPlay } from "@/components/icon/svg-icon-play";

const VIDEO_POSTER_WIDTH = 1920;
const VIDEO_POSTER_HEIGHT = 1080;

type VideoProps = {
  src: string;
  poster: string;
  alt: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

const Video = ({ src, poster, alt, className }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { value: isPlaying, setTrue: handlePlay } = useBoolean();

  if (isPlaying) {
    return (
      <video ref={videoRef} src={src} className={cn("size-full", className)} autoPlay controls>
        <track kind="captions" />
      </video>
    );
  }

  return (
    <button
      type="button"
      className={cn("relative block size-full cursor-pointer", className)}
      onClick={handlePlay}
    >
      <Image
        src={poster}
        alt={alt}
        width={VIDEO_POSTER_WIDTH}
        height={VIDEO_POSTER_HEIGHT}
        className="size-full rounded-2xl object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-transform hover:scale-110">
          <SvgIconPlay size="xl" className="text-white" />
        </div>
      </div>
    </button>
  );
};

export { Video, type VideoProps };
