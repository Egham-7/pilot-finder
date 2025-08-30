import type { Experimental_GeneratedImage } from "ai";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

export type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export const Image = ({
  base64,
  uint8Array,
  mediaType,
  width = 500,
  height = 300,
  ...props
}: ImageProps) => (
  <NextImage
    {...props}
    alt={props.alt || "Generated image"}
    width={width}
    height={height}
    className={cn(
      "h-auto max-w-full overflow-hidden rounded-md",
      props.className,
    )}
    src={`data:${mediaType};base64,${base64}`}
  />
);
