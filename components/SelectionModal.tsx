
import React from 'react';
import { X, Check } from 'lucide-react';
import { SelectionOption } from '../constants';

interface SelectionModalProps {
  title: string;
  description?: string;
  options: SelectionOption[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  icon?: React.ReactNode;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  title,
  description,
  options,
  selected,
  onSelect,
  onClose,
  icon
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl max-h-[85vh] bg-dnd-slate border border-dnd-gold/30 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-dnd-dark to-dnd-slate">
          <div>
            <h2 className="text-2xl font-serif font-bold text-dnd-gold flex items-center gap-2">
              {icon}
              {title}
            </h2>
            {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-dnd-dark/50 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((opt) => {
              const isSelected = selected === opt.name;
              return (
                <button
                  key={opt.name}
                  onClick={() => {
                     onSelect(opt.name);
                     onClose();
                  }}
                  className={`text-left p-6 rounded-lg border transition-all relative group flex flex-col h-full ${
                    isSelected
                      ? 'bg-dnd-dark border-dnd-gold shadow-[0_0_15px_rgba(201,173,106,0.15)]'
                      : 'bg-dnd-slate border-white/10 hover:border-dnd-gold hover:shadow-lg hover:shadow-dnd-gold/10 hover:-translate-y-1'
                  }`}
                >
                    {isSelected && (
                         <div className="absolute top-4 right-4 text-dnd-gold bg-dnd-gold/10 p-1 rounded-full border border-dnd-gold/30">
                           <Check className="w-4 h-4" />
                         </div>
                    )}

                    <div className="flex flex-col h-full">
                        <div className="mb-3 text-center w-full">
                           <h3 className={`font-serif font-bold text-2xl mb-2 ${isSelected ? 'text-dnd-gold' : 'text-gray-200 group-hover:text-dnd-gold'}`}>
                              {opt.name}
                           </h3>
                           <div className={`h-1 w-12 mx-auto rounded-full transition-colors ${isSelected ? 'bg-dnd-gold' : 'bg-white/10 group-hover:bg-dnd-gold/50'}`} />
                        </div>
                        
                        <p className="text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors">
                           {opt.description}
                        </p>
                    </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
