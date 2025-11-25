
import React, { useState } from 'react';
import { X, Star, ArrowLeft, PenTool, Check, Plus } from 'lucide-react';
import { Feat, FeatureType, Character } from '../types';
import { FEATURES_DATA } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface FeatModalProps {
  character: Character;
  onClose: () => void;
  onAddFeat: (feat: Feat) => void;
}

export const FeatModal: React.FC<FeatModalProps> = ({ character, onClose, onAddFeat }) => {
  const { t } = useLanguage();
  const [isCustomFeatView, setIsCustomFeatView] = useState(false);
  const [customFeat, setCustomFeat] = useState<Feat>({
    name: '',
    source: 'Custom',
    type: 'passive',
    description: '',
    repeatable: false,
    isActive: false
  });

  const handleSelectFeat = (feat: Feat) => {
    onAddFeat(feat);
    if (!feat.repeatable) {
      onClose();
    }
  };

  const handleSaveCustomFeat = () => {
    if (!customFeat.name.trim()) return;
    onAddFeat(customFeat);
    setCustomFeat({
        name: '',
        source: 'Custom',
        type: 'passive',
        description: '',
        repeatable: false,
        isActive: false
    });
    setIsCustomFeatView(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl h-[85vh] bg-dnd-slate border border-dnd-gold/30 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-dnd-dark to-dnd-slate">
          <div>
            <h2 className="text-2xl font-serif font-bold text-dnd-gold flex items-center gap-2">
              {isCustomFeatView ? (
                 <button onClick={() => setIsCustomFeatView(false)} className="hover:text-white mr-2">
                    <ArrowLeft className="w-6 h-6" />
                 </button>
              ) : <Star className="w-6 h-6" />}
              {isCustomFeatView ? t('createCustomFeature') : t('selectFeature')}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
                {isCustomFeatView ? t('createCustomFeatureDesc') : t('selectFeatureDesc')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-dnd-dark/50">
          
          {isCustomFeatView ? (
             // Custom Feature Form
             <div className="max-w-2xl mx-auto space-y-6 bg-dnd-slate/30 p-8 rounded-xl border border-white/5">
                <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-2">{t('featureName')} <span className="text-red-400">*</span></label>
                    <input 
                        type="text" 
                        value={customFeat.name}
                        onChange={(e) => setCustomFeat({...customFeat, name: e.target.value})}
                        placeholder="e.g. Secret Technique"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-dnd-gold outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-400 mb-2">{t('source')}</label>
                        <input 
                            type="text" 
                            value={customFeat.source}
                            onChange={(e) => setCustomFeat({...customFeat, source: e.target.value})}
                            placeholder="e.g. Homebrew, Clan Trait"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-dnd-gold outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-400 mb-2">{t('type')}</label>
                        <select 
                            value={customFeat.type}
                            onChange={(e) => setCustomFeat({...customFeat, type: e.target.value as FeatureType})}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-dnd-gold outline-none appearance-none"
                        >
                            <option value="passive">Passive</option>
                            <option value="active">Active</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-2">{t('description')}</label>
                    <textarea 
                        value={customFeat.description}
                        onChange={(e) => setCustomFeat({...customFeat, description: e.target.value})}
                        placeholder="Describe what this feature does..."
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-dnd-gold outline-none resize-none"
                    />
                </div>

                <div className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5">
                    <input 
                        type="checkbox" 
                        id="repeatable"
                        checked={customFeat.repeatable}
                        onChange={(e) => setCustomFeat({...customFeat, repeatable: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-500 text-dnd-gold focus:ring-dnd-gold bg-transparent"
                    />
                    <label htmlFor="repeatable" className="text-sm text-gray-300 cursor-pointer">
                        {t('repeatable')}
                    </label>
                </div>

                <div className="pt-4 flex gap-3">
                    <button 
                        onClick={() => setIsCustomFeatView(false)}
                        className="flex-1 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-bold"
                    >
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={handleSaveCustomFeat}
                        disabled={!customFeat.name.trim()}
                        className={`flex-1 py-3 rounded-lg font-bold text-dnd-dark transition-colors flex items-center justify-center gap-2 ${!customFeat.name.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-dnd-gold hover:bg-yellow-500'}`}
                    >
                        <Plus className="w-5 h-5" />
                        {t('addFeature')}
                    </button>
                </div>
             </div>
          ) : (
            // Feature Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Create Custom Card */}
              <button 
                  onClick={() => setIsCustomFeatView(true)}
                  className="text-left p-5 rounded-lg border border-dashed border-dnd-gold/30 bg-dnd-gold/5 hover:bg-dnd-gold/10 hover:border-dnd-gold transition-all relative group flex flex-col h-full items-center justify-center min-h-[160px]"
              >
                 <div className="w-12 h-12 rounded-full bg-dnd-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-dnd-gold">
                    <PenTool className="w-6 h-6" />
                 </div>
                 <h3 className="font-serif font-bold text-lg text-dnd-gold">{t('createCustom')}</h3>
                 <p className="text-sm text-center text-gray-400 mt-2">{t('customFeatDesc')}</p>
              </button>

              {FEATURES_DATA.map((feat, idx) => {
                const count = character.feats.filter(f => f.name === feat.name).length;
                const isAdded = count > 0;
                const canAdd = feat.repeatable || !isAdded;

                return (
                  <button 
                    key={idx}
                    onClick={() => canAdd && handleSelectFeat(feat as Feat)}
                    disabled={!canAdd}
                    className={`text-left p-5 rounded-lg border transition-all relative group flex flex-col h-full ${
                      !canAdd 
                        ? 'bg-dnd-dark/30 border-white/5 opacity-50 cursor-not-allowed' 
                        : 'bg-dnd-slate border-white/10 hover:border-dnd-gold hover:shadow-lg hover:shadow-dnd-gold/10 hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-serif font-bold text-lg ${!canAdd ? 'text-gray-500' : 'text-dnd-gold'}`}>
                        {feat.name}
                      </h3>
                      {isAdded && !feat.repeatable ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <Check className="w-3 h-3" /> {t('added')}
                        </span>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-dnd-gold group-hover:bg-dnd-gold group-hover:text-dnd-dark transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    {isAdded && feat.repeatable && (
                        <div className="absolute top-5 right-12 text-[10px] font-bold uppercase text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
                          x{count}
                        </div>
                    )}
                    
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded bg-cyan-950/20">
                        {feat.source}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/20 border ${
                        feat.type === 'active' ? 'text-orange-400 border-orange-400/30' : 'text-gray-400 border-gray-400/30'
                      }`}>
                        {feat.type}
                      </span>
                      {feat.repeatable && (
                         <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded bg-purple-950/20">
                          {t('repeatable')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed font-sans">{feat.description}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
