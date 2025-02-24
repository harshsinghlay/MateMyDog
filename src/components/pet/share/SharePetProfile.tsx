import React, { useState } from 'react';
import { X, Copy, Mail, QrCode } from 'lucide-react';
import type { Pet } from '../../../types/pet';
import { ShareQRCode } from './ShareQRCode';
import { APP_CONFIG } from '../../../config/constants';

interface SharePetProfileProps {
  pet: Pet;
  postId?: string;
  onClose: () => void;
}

export function SharePetProfile({ pet,postId, onClose }: SharePetProfileProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = postId 
  ? `${APP_CONFIG.baseUrl}${APP_CONFIG.routes.socialPost(postId)}`
  : `${APP_CONFIG.baseUrl}${APP_CONFIG.routes.petProfile(pet.id)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmailShare = () => {
    const subject = `Pet Profile: ${pet.name}`;
    const body = `Check out ${pet.name}'s pet profile: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">Share Pet Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Pet Preview */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed}</p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Copy className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Copy Link</span>
                </div>
                <span className="text-sm text-gray-500">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>

              {/* Email */}
              <button
                onClick={handleEmailShare}
                className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Share via Email</span>
                </div>
                <span className="text-sm text-gray-500">Send</span>
              </button>

              {/* QR Code */}
              <button
                onClick={() => setShowQR(true)}
                className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <QrCode className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Show QR Code</span>
                </div>
                <span className="text-sm text-gray-500">View</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Anyone with the link can view {pet.name}'s basic profile information
            </p>
          </div>
        </div>
      </div>

      {showQR && (
        <ShareQRCode
          url={shareUrl}
          petName={pet.name}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}