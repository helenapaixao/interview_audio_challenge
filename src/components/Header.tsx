import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation(); 

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white fixed w-full z-10 shadow-md">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold tracking-wide">Audio Interview</span>
        </Link>

        <div className="hidden lg:flex space-x-6">
          {location.pathname !== "/interview" && (
            <Link
              to="/interview"
              className="text-sm font-medium hover:text-gray-200 transition-colors"
            >
              Entrevista
            </Link>
          )}
          {location.pathname !== "/history" && (
            <Link
              to="/history"
              className="text-sm font-medium hover:text-gray-200 transition-colors"
            >
              Histórico
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden inline-flex items-center p-2 text-sm text-white hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open Menu"
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-blue-700 text-white transition-all duration-300">
          {location.pathname !== "/interview" && (
            <Link
              to="/interview"
              className="block px-4 py-2 text-sm font-medium hover:bg-blue-600"
            >
              Entrevista
            </Link>
          )}
          {location.pathname !== "/history" && (
            <Link
              to="/history"
              className="block px-4 py-2 text-sm font-medium hover:bg-blue-600"
            >
              Histórico
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
