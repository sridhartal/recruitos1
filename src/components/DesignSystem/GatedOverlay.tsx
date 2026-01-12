import React from 'react';
import { Lock } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface GatedOverlayProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

/**
 * Gated Overlay (The "Blur" Lock)
 * Used to lock content as seen in the video.
 */
export const GatedOverlay = ({ 
  title = "Unlock Candidate Details",
  description = "Blurred profiles hide full info — upgrade to connect instantly.",
  buttonLabel = "Start Free Trial",
  onButtonClick
}: GatedOverlayProps) => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl">
    <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900">
        <Lock size={20} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 text-sm">{description}</p>
      <PrimaryButton label={buttonLabel} onClick={onButtonClick} />
    </div>
  </div>
);
