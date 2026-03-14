'use client';

import React from 'react';

interface ExpertCardProps {
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
  skills?: string[];
  variant?: 'default' | 'gradient' | 'dark';
}

export default function ExpertCard({
  name,
  role,
  avatar,
  rating = 4.5,
  skills = [],
  variant = 'default',
}: ExpertCardProps) {
  const variants = {
    default: 'bg-white border border-gray-200',
    gradient: 'bg-gradient-to-br from-purple-600 to-blue-600 text-white',
    dark: 'bg-slate-900 text-white',
  };

  return (
    <div className={`max-w-[300px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${variants[variant]}`}>
      {/* Avatar Area (40% of card) */}
      <div className="h-[160px] bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
        {avatar ? (
          <img src={avatar} alt={name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">{name}</h3>
        <p className={`text-sm mb-3 ${variant === 'default' ? 'text-gray-600' : 'text-white/80'}`}>{role}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-500">★</span>
          <span className={`text-sm font-medium ${variant === 'default' ? 'text-gray-700' : 'text-white'}`}>{rating}</span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className={`text-xs px-2 py-1 rounded-full ${
                  variant === 'default'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white/20 text-white'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Button */}
        <button className={`w-full py-2 rounded-lg font-medium transition-all ${
          variant === 'default'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-purple-600 hover:bg-white/90'
        }`}>
          View Profile
        </button>
      </div>
    </div>
  );
}
