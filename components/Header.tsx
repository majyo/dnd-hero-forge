
import React from 'react';
import { Dna, Check, Edit3 } from 'lucide-react';

interface HeaderProps {
  view: 'edit' | 'sheet';
  setView: (view: 'edit' | 'sheet') => void;
}

export const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  return (
    <header className="w-full bg-dnd-dark border-b border-dnd-gold/20 p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-dnd-red to-red-900 p-2 rounded-lg shadow-lg border border-white/10">
            <Dna className="w-6 h-6 text-dnd-gold" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-100 tracking-wide">Forge of Heroes</h1>
            <p className="text-xs text-dnd-gold uppercase tracking-wider">D&D 5e 2024 Edition</p>
          </div>
        </div>
        
        <div className="flex gap-3">
           {view === 'edit' ? (
             <button 
                onClick={() => setView('sheet')}
                className="flex items-center gap-2 bg-dnd-gold hover:bg-yellow-600 text-dnd-dark px-4 py-2 rounded-md font-bold transition-all"
             >
                <Check className="w-4 h-4" /> View Sheet
             </button>
           ) : (
             <button 
                onClick={() => setView('edit')}
                className="flex items-center gap-2 bg-dnd-slate hover:bg-gray-700 text-white border border-white/20 px-4 py-2 rounded-md transition-all"
             >
                <Edit3 className="w-4 h-4" /> Edit
             </button>
           )}
        </div>
      </div>
    </header>
  );
};
