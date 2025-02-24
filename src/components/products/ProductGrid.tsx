import React from 'react';
import { ProductCard } from './ProductCard';

const products = [
  {
    id: 1,
    title: 'Natural Dog Shampoo - Tilting Heads',
    price: 'Rs. 919.00',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    backgroundColor: 'bg-sage-100',
    tagline: 'Gentle Care for Sensitive Skin'
  },
  {
    id: 2,
    title: 'Calming Dog Shampoo - Tilting Heads',
    price: 'Rs. 919.00',
    imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    backgroundColor: 'bg-blue-100',
    tagline: 'Soothing Bath Time'
  },
  {
    id: 3,
    title: 'Medicated Dog Shampoo - Tilting Heads',
    price: 'Rs. 919.00',
    imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    backgroundColor: 'bg-purple-100',
    tagline: 'Advanced Skin Treatment'
  },
  {
    id: 4,
    title: 'Anti-Flea Dog Shampoo - Tilting Heads',
    price: 'Rs. 919.00',
    imageUrl: 'https://images.unsplash.com/photo-1584949514490-73fc1a2faa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    backgroundColor: 'bg-warm-gray-100',
    tagline: 'Natural Pest Protection'
  }
];

export function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}