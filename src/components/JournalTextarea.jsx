import React from 'react';

const JournalTextarea = ({ value, onChange, placeholder }) => (
  <textarea
    className="w-full min-h-[120px] p-3 border border-slate-300 rounded font-mono bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default JournalTextarea; 