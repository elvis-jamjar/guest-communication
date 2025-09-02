"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface DynamicImageProps {
  src: string;
  alt: string;
}
export const DynamicImage: React.FC<DynamicImageProps> = ({ src, alt }) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  useEffect(() => {
    const img = new window.Image(); // Explicitly using window.Image to avoid SSR issues
    img.src = src;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [src]);

  return (
    <div className="image-container">
      {(imageSize.width && imageSize.height) ? (
        <Image
          src={src}
          alt={alt}
          width={imageSize.width}
          height={imageSize.height}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          quality={100}
          priority={true}
          fetchPriority='high'
          // objectFit="cover"
          layout="intrinsic"
          className='rounded-sm w-32 h-24 object-contain object-center'
        />
      ) : (
        <div className="rounded-md w-32 h-16 bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
};
