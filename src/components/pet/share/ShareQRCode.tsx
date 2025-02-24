import React from 'react';
import { X } from 'lucide-react';

interface ShareQRCodeProps {
  url: string;
  petName: string;
  onClose: () => void;
}

export function ShareQRCode({ url, petName, onClose }: ShareQRCodeProps) {
  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">QR Code for {petName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={qrCodeUrl}
            alt={`QR code for ${petName}'s profile`}
            className="w-48 h-48"
          />
          <p className="text-sm text-gray-500 text-center">
            Scan this QR code to view {petName}'s profile
          </p>
        </div>
      </div>
    </div>
  );
}