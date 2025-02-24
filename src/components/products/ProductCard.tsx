import React from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: string;
  backgroundColor: string;
  tagline: string;
}

export function ProductCard({ title, price, imageUrl, backgroundColor, tagline }: ProductCardProps) {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast('Please sign in to add items to cart', {
        icon: '🔒',
      });
      return;
    }
    // Handle add to cart logic here
    toast.success('Added to cart');
  };

  return (
    <div className="group relative">
      <div className={`relative aspect-square overflow-hidden rounded-lg ${backgroundColor}`}>
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h3 className="text-2xl font-light text-white uppercase tracking-wider text-center px-4">
            {tagline}
          </h3>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500">{price}</p>
        <button 
          onClick={handleAddToCart}
          className="w-full py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}