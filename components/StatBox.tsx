
import React from 'react';
import { Ability } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface StatBoxProps {
  ability: Ability;
  value: number;
  onChange: (val: number) => void;
  readOnly?: boolean;
}

export const StatBox: React.FC<StatBoxProps> = ({ ability, value, onChange, readOnly }) => {
  const { t } = useLanguage();
  const modifier = Math.floor((value - 10) / 2);
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <div className="flex flex-col items-center bg-dnd-slate border border-dnd-gold/30 rounded-lg p-3 w-24 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dnd-gold to-transparent opacity-50" />
      
      <span className="text-xs uppercase tracking-widest text-gray-400 font-serif mb-1">{t(ability)}</span>
      
      <div className="relative">
        <span className="text-3xl font-bold text-white font-serif">{modifier >= 0 ? '+' : ''}{modifier}</span>
      </div>

      {readOnly ? (
        <div className="mt-2 bg-dnd-dark/50 rounded-full px-3 py-0.5 border border-white/10">
             <span className="text-sm text-gray-300 font-bold">{value}</span>
        </div>
      ) : (
        <input 
            type="number" 
            min="1" 
            max="30"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 10)}
            className="mt-2 w-12 text-center bg-dnd-dark/50 border border-white/10 rounded text-sm text-gray-300 focus:border-dnd-gold focus:outline-none"
        />
      )}
    </div>
  );
};
