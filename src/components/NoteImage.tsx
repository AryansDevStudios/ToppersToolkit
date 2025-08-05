
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type NoteImageProps = {
  src?: string;
  alt: string;
  fallbackIcon: React.ReactNode;
};

export function NoteImage({ src, alt, fallbackIcon }: NoteImageProps) {
  const [error, setError] = useState(false);

  // Reset error state if the src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  const defaultImage = 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true';
  const imageSrc = src && !error ? src : defaultImage;

  if (!src || error) {
    return <>{fallbackIcon}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className="h-full w-full object-cover"
      data-ai-hint="note education"
      onError={() => setError(true)}
    />
  );
}
