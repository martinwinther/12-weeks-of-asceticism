import React from 'react';

const JournalTextarea = ({ value, onChange, placeholder }) => (
  <textarea
    className="w-full min-h-[120px] p-3 border border-accent rounded font-mono bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default JournalTextarea; 