import React, { useEffect } from 'react';
import { getEmbedUrl } from '../../utils/videoEmbed';

export default function VideoModal({ videoUrl, isOpen, onClose }) {
  const embedUrl = getEmbedUrl(videoUrl);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // prevent background scroll while open
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !embedUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-blue transition-colors"
          aria-label="Close video"
        >
          ✕
        </button>
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Boostr Netwave Leadership Video"
        />
      </div>
    </div>
  );
}
