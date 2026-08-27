import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ message = "The page you're looking for doesn't exist or has been moved." }) {
  return (
    <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-blue-pale rounded-2xl flex items-center justify-center mb-8 mx-auto reveal visible">
        <i className="fa-solid fa-ghost text-blue text-3xl"></i>
      </div>
      <h1 className="font-display font-black text-ink text-4xl md:text-5xl tracking-tighter mb-4 reveal visible stagger-1">
        Page Not Found
      </h1>
      <p className="text-muted text-lg max-w-md mx-auto mb-10 reveal visible stagger-2">
        {message}
      </p>
      <div className="reveal visible stagger-3">
        <Link to="/" className="magnetic-btn inline-flex items-center gap-3 bg-blue text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-light transition-all shadow-[0_15px_30px_rgba(0,82,255,0.15)] hover:-translate-y-1">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
