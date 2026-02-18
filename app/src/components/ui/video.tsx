"use client";

import type { HTMLAttributes } from "react";
import { useRef } from "react";
import Image from "next/image";
import { useBoolean } from "usehooks-ts";

import { SvgIconPlay } from "@/components/icon/svg-icon-play";
import { cn } from "@/utils/helpers";

type VideoProps = {
  src: string;
  poster: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

const Video = ({ src, poster, className }: VideoProps) => {
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
      <Image src={poster} alt="" fill className="size-full rounded-2xl object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-gray-100/75 transition-transform hover:scale-110">
          <SvgIconPlay size="lg" className="ml-0.5 text-white" />
        </div>
      </div>
    </button>
  );
};

export { Video, type VideoProps };
