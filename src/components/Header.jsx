import React from 'react';

const Header = ({ title }) => (
  <header className="w-full py-6 bg-background text-primary font-serif text-center text-3xl font-bold border-b border-accent">
    {title}
  </header>
);

export default Header; 