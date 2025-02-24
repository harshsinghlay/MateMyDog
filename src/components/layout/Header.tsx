import { useState } from 'react';
import { UserCircle2, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { NavLink } from '../ui/NavLink';
import { AuthModal } from '../auth/AuthModal';
import { UserAvatar } from '../ui/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// External URLs
const EXTERNAL_URLS = {
  products: "https://www.tiltingheads.com/",
  blog: "https://www.tiltingheads.com/blogs/latest-blogs",
  contact: "https://www.tiltingheads.com/pages/contact"
};

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: EXTERNAL_URLS.products, isExternal: true },
    { label: 'Pet Matching', href: '/matching' },
    { label: 'Pets', href: '/pets' },
    { label: 'Blog', href: EXTERNAL_URLS.blog, isExternal: true },
    { label: 'Contact', href: EXTERNAL_URLS.contact, isExternal: true }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const renderNavItem = (item: typeof navItems[0]) => {
    if (item.isExternal) {
      return (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.href}
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(renderNavItem)}
          </nav>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="p-2 hover:text-gray-600 flex items-center">
                  <UserAvatar user={user} size="sm" />
                </button>
                <div className="absolute right-0 w-40 mt-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button 
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 hover:text-gray-600"
              >
                <UserCircle2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.href} className="block px-3 py-2">
                {renderNavItem(item)}
              </div>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}