import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  );
}