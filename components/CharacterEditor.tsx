

import React, { useState } from 'react';
import { Shield, Scroll, Sword, Sparkles, RefreshCw, BookOpen, Circle, Disc, Trophy, Trash2, Plus, Heart, X, Zap, Backpack, Flame, Activity, Landmark, ChevronRight, Crown, Package, Users, Scale, Wrench, Languages } from 'lucide-react';
import { Ability, Character, ProficiencyLevel, Spell, EquipmentItem } from '../types';
import { SPECIES_DATA, SUBCLASS_DATA, BACKGROUND_DATA, ALIGNMENT_DATA, SKILL_DATA, CLASS_HIT_DICE, EXAMPLE_EQUIPMENT, TOOL_DATA, LANGUAGE_DATA } from '../constants';
import { StatBox } from './StatBox';
import { SelectionModal } from './SelectionModal';
import { getProficiencyBonus, calculateSkillBonus, calculateSpellSaveDC, calculateSpellAttackBonus } from '../utils/characterUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface CharacterEditorProps {
  character: Character;
  updateField: (field: keyof Character, value: any) => void;
  updateStat: (ability: Ability, value: number) => void;
  addClassLevel: (subclassName: string, className: string) => void;
  removeClassLevel: (index: number) => void;
  setSkillLevel: (skillName: string, level: ProficiencyLevel) => void;
  removeFeat: (index: number) => void;
  toggleFeatureActive: (index: number) => void;
  addEquipment: (item: EquipmentItem) => void;
  removeEquipment: (index: number) => void;
  updateEquipmentQuantity: (index: number, quantity: number) => void;
  autoCalculateVitals: () => void;
  addSpell: (spell: Spell) => void;
  removeSpell: (index: number) => void;
  toggleSpellPrepared: (index: number) => void;
  updateSpellSlot: (level: number, max: number) => void;
  addToolProficiency: (tool: string) => void;
  removeToolProficiency: (tool: string) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  
  // AI specific props
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  isGenerating: boolean;
  onQuickBuild: () => void;
  isGeneratingBackstory: boolean;
  onGenerateBackstory: () => void;
  onSuggestName: () => void;

  onOpenFeatModal: () => void;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({
  character,
  updateField,
  updateStat,
  addClassLevel,
  removeClassLevel,
  setSkillLevel,
  removeFeat,
  toggleFeatureActive,
  addEquipment,
  removeEquipment,
  updateEquipmentQuantity,
  autoCalculateVitals,
  addSpell,
  removeSpell,
  toggleSpellPrepared,
  updateSpellSlot,
  addToolProficiency,
  removeToolProficiency,
  addLanguage,
  removeLanguage,
  aiPrompt,
  setAiPrompt,
  isGenerating,
  onQuickBuild,
  isGeneratingBackstory,
  onGenerateBackstory,
  onSuggestName,
  onOpenFeatModal
}) => {
  const { t } = useLanguage();
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');
  const [newItemDesc, setNewItemDesc] = useState('');
  
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellLevel, setNewSpellLevel] = useState(0);
  const [activeModal, setActiveModal] = useState<'species' | 'class' | 'background' | 'alignment' | 'tools' | 'languages' | null>(null);

  const hitDie = CLASS_HIT_DICE[character.classHistory[0]?.className] || 8;

  const handleAddEquipment = () => {
    if (!newItemName.trim()) return;
    addEquipment({
      name: newItemName.trim(),
      category: newItemCategory,
      description: newItemDesc,
      quantity: 1
    });
    setNewItemName('');
    setNewItemDesc('');
    setNewItemCategory('General');
  };

  const handleAddExampleGear = () => {
     EXAMPLE_EQUIPMENT.forEach(item => {
        addEquipment(item);
     });
  };

  const handleAddSpell = () => {
      if(!newSpellName.trim()) return;
      addSpell({
          name: newSpellName,
          level: newSpellLevel,
          prepared: false
      });
      setNewSpellName('');
  };

  const renderAISection = () => (
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 blur-3xl opacity-20 rounded-full pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-indigo-300">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-serif font-bold tracking-wide text-sm uppercase">{t('aiTitle')}</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder={t('aiPlaceholder')}
            className="flex-1 bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 transition-colors"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onQuickBuild()}
          />
          <button 
            onClick={onQuickBuild}
            disabled={isGenerating || !aiPrompt}
            className={`px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 transition-all shadow-lg ${isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'}`}
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? t('generating') : t('generate')}
          </button>
        </div>
        <p className="text-xs text-indigo-300/60 mt-2 ml-1">
          {t('aiDisclaimer')}
        </p>
      </div>
    </div>
  );

  const renderSelectionCard = (label: string, value: string, icon: React.ReactNode, onClick: () => void) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-start justify-between p-5 rounded-xl border border-white/10 bg-dnd-slate/50 hover:bg-dnd-slate hover:border-dnd-gold/50 hover:shadow-lg hover:shadow-dnd-gold/5 transition-all group text-left h-full relative overflow-hidden"
    >
       <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-dnd-gold">
         <ChevronRight className="w-5 h-5" />
       </div>
       <div className="flex items-center gap-2 text-gray-400 group-hover:text-dnd-gold mb-3 transition-colors">
          {icon}
          <span className="text-xs uppercase font-bold tracking-wider">{label}</span>
       </div>
       <div className="font-serif font-bold text-2xl text-white group-hover:text-dnd-gold break-words w-full transition-colors">
          {value}
       </div>
       <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-dnd-gold w-0 group-hover:w-full transition-all duration-500 ease-out" />
       </div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      {renderAISection()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Info & Skills */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Bar: Name Only */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Shield className="w-5 h-5" /> {t('coreIdentity')}
             </h3>
             
             <div className="space-y-1">
                 <label className="text-xs text-gray-400 uppercase font-bold">{t('characterName')}</label>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={character.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none"
                    />
                    <button 
                      onClick={onSuggestName}
                      className="bg-dnd-dark border border-white/10 hover:border-dnd-gold p-2 rounded text-dnd-gold"
                      title={t('suggestName')}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                 </div>
               </div>
          </div>

          {/* Origin Section (Species, Background, Alignment) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {renderSelectionCard(t('species'), character.species, <Users className="w-5 h-5"/>, () => setActiveModal('species'))}
             {renderSelectionCard(t('background'), character.background, <Landmark className="w-5 h-5"/>, () => setActiveModal('background'))}
             {renderSelectionCard(t('alignment'), character.alignment, <Scale className="w-5 h-5"/>, () => setActiveModal('alignment'))}
          </div>

          {/* Class & Level Progression */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
               <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                 <Crown className="w-5 h-5" /> {t('classProgression')}
               </h3>
               <button 
                 onClick={() => setActiveModal('class')}
                 className="bg-dnd-gold text-dnd-dark font-bold px-4 py-1.5 rounded hover:bg-yellow-600 flex items-center gap-2 text-sm transition-colors shadow-lg shadow-dnd-gold/10"
               >
                 <Plus className="w-4 h-4" /> {t('addLevel')}
               </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {character.classHistory.length === 0 && (
                 <div className="text-center py-8 border border-dashed border-white/10 rounded-lg bg-black/20">
                   <p className="text-gray-500 italic">{t('noLevels')}</p>
                   <p className="text-xs text-gray-600 mt-1">{t('clickAddLevel')}</p>
                 </div>
               )}
               {character.classHistory.map((levelEntry, idx) => (
                 <div key={levelEntry.id} className="p-4 rounded-lg border bg-dnd-dark border-dnd-gold/20 flex flex-col gap-3 transition-all hover:border-dnd-gold">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-dnd-slate border border-white/10 flex items-center justify-center font-serif font-bold text-dnd-gold shadow-inner">
                           {idx + 1}
                         </div>
                         <div>
                            <h4 className="font-bold text-base text-gray-200">{levelEntry.subclassName || levelEntry.className}</h4>
                            <div className="flex gap-2">
                                <span className="text-[10px] text-cyan-400 uppercase border border-cyan-900 bg-cyan-950/30 px-1.5 rounded tracking-wider">
                                    {t('hitDie')}: d{levelEntry.hitDie}
                                </span>
                                {levelEntry.subclassName && levelEntry.subclassName !== levelEntry.className && (
                                   <span className="text-[10px] text-purple-400 uppercase border border-purple-900 bg-purple-950/30 px-1.5 rounded tracking-wider">
                                       {levelEntry.className}
                                   </span>
                                )}
                                {idx === 0 && <span className="text-[10px] text-orange-400 uppercase border border-orange-900 bg-orange-950/30 px-1.5 rounded tracking-wider">{t('primary')}</span>}
                            </div>
                         </div>
                      </div>
                      
                      <button 
                        onClick={() => removeClassLevel(idx)}
                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                        title={t('remove')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                 </div>
               ))}
               {character.classHistory.length > 0 && (
                   <div className="flex justify-end pt-2">
                       <div className="text-xs text-gray-500 uppercase font-bold">
                           {t('totalLevel')}: <span className="text-white text-lg ml-1">{character.classHistory.length}</span>
                       </div>
                   </div>
               )}
             </div>
          </div>

          {/* Tools & Languages Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tools */}
              <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                      <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                          <Wrench className="w-5 h-5" /> {t('toolProficiencies')}
                      </h3>
                      <button 
                          onClick={() => setActiveModal('tools')}
                          className="bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/30 hover:bg-dnd-gold hover:text-dnd-dark p-1.5 rounded transition-colors"
                      >
                          <Plus className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {character.toolProficiencies.length === 0 && <span className="text-sm text-gray-500 italic">{t('noTools')}</span>}
                      {character.toolProficiencies.map(tool => (
                          <div key={tool} className="flex items-center gap-2 bg-dnd-dark border border-white/10 rounded px-2 py-1 text-sm text-gray-200">
                              <span>{tool}</span>
                              <button onClick={() => removeToolProficiency(tool)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Languages */}
              <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                      <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                          <Languages className="w-5 h-5" /> {t('languages')}
                      </h3>
                      <button 
                          onClick={() => setActiveModal('languages')}
                          className="bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/30 hover:bg-dnd-gold hover:text-dnd-dark p-1.5 rounded transition-colors"
                      >
                          <Plus className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {character.languages.length === 0 && <span className="text-sm text-gray-500 italic">{t('noLanguages')}</span>}
                      {character.languages.map(lang => (
                          <div key={lang} className="flex items-center gap-2 bg-dnd-dark border border-white/10 rounded px-2 py-1 text-sm text-gray-200">
                              <span>{lang}</span>
                              <button onClick={() => removeLanguage(lang)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Skills Section */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center justify-between">
               <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> {t('skillProficiencies')}</div>
               <div className="text-xs text-gray-500 font-sans font-normal">
                 {t('pb')}: <span className="text-dnd-gold">+{getProficiencyBonus(character.level)}</span>
               </div>
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {SKILL_DATA.map((skill) => {
                  const currentLevel = character.skills[skill.name] || 'none';
                  const bonus = calculateSkillBonus(skill.name, skill.ability as Ability, character);
                  
                  return (
                    <div key={skill.name} className="flex items-center justify-between py-2 border-b border-white/5 group hover:bg-white/5 px-2 rounded transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-bold w-8 text-right ${currentLevel !== 'none' ? 'text-dnd-gold' : 'text-gray-500'}`}>
                          {bonus >= 0 ? '+' : ''}{bonus}
                        </span>
                        <div className="flex flex-col">
                          <span className={`text-sm ${currentLevel !== 'none' ? 'text-white font-medium' : 'text-gray-400'}`}>{skill.name}</span>
                          <span className="text-[10px] text-gray-600 uppercase tracking-wider">{skill.ability.substring(0, 3)}</span>
                        </div>
                      </div>

                      <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                         <button 
                            onClick={() => setSkillLevel(skill.name, 'none')}
                            className={`p-1.5 rounded ${currentLevel === 'none' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Not Proficient"
                         >
                            <Circle className="w-3 h-3" />
                         </button>
                         <button 
                            onClick={() => setSkillLevel(skill.name, 'proficient')}
                            className={`p-1.5 rounded ${currentLevel === 'proficient' ? 'bg-dnd-gold text-dnd-dark' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Proficient"
                         >
                            <Disc className="w-3 h-3" />
                         </button>
                         <button 
                            onClick={() => setSkillLevel(skill.name, 'expertise')}
                            className={`p-1.5 rounded ${currentLevel === 'expertise' ? 'bg-dnd-gold text-dnd-dark' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Expertise"
                         >
                            <Trophy className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  )
                })}
             </div>
          </div>
          
          {/* Feats & Features Section */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
               <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                 <Zap className="w-5 h-5" /> {t('featuresTraits')}
               </h3>
               <button 
                 onClick={onOpenFeatModal}
                 className="bg-dnd-gold text-dnd-dark font-bold px-4 py-1.5 rounded hover:bg-yellow-600 flex items-center gap-2 text-sm transition-colors shadow-lg shadow-dnd-gold/10"
               >
                 <Plus className="w-4 h-4" /> {t('addFeature')}
               </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {character.feats.length === 0 && (
                 <div className="text-center py-8 border border-dashed border-white/10 rounded-lg bg-black/20">
                   <p className="text-gray-500 italic">{t('noFeatures')}</p>
                   <p className="text-xs text-gray-600 mt-1">{t('clickAddFeature')}</p>
                 </div>
               )}
               {character.feats.map((feat, idx) => (
                 <div key={idx} className={`p-4 rounded-lg border flex flex-col gap-3 transition-all ${feat.isActive ? 'bg-dnd-dark border-dnd-gold shadow-[0_0_15px_rgba(201,173,106,0.15)]' : 'bg-dnd-dark/50 border-white/5'}`}>
                   <div className="flex justify-between items-start">
                      <div className="flex-1">
                         <div className="flex flex-wrap items-center gap-2 mb-2">
                             <h4 className={`font-bold text-base ${feat.isActive ? 'text-dnd-gold text-shadow-glow' : 'text-gray-200'}`}>{feat.name}</h4>
                             <span className="text-[10px] text-cyan-400 uppercase border border-cyan-900 bg-cyan-950/30 px-1.5 rounded tracking-wider">{feat.source}</span>
                             {feat.type === 'active' && (
                               <span className="text-[10px] text-orange-400 uppercase border border-orange-900 bg-orange-950/30 px-1.5 rounded tracking-wider">{t('active')}</span>
                             )}
                             {feat.repeatable && (
                               <span className="text-[10px] text-purple-400 uppercase border border-purple-900 bg-purple-950/30 px-1.5 rounded tracking-wider">{t('repeatable')}</span>
                             )}
                         </div>
                         <p className="text-sm text-gray-400 leading-snug">{feat.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-4">
                         {feat.type === 'active' && (
                           <div className="flex flex-col items-center gap-1">
                             <button 
                               onClick={() => toggleFeatureActive(idx)}
                               className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${feat.isActive ? 'bg-dnd-gold' : 'bg-gray-700'}`}
                             >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${feat.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                             </button>
                             <span className={`text-[9px] uppercase font-bold tracking-wider ${feat.isActive ? 'text-dnd-gold' : 'text-gray-600'}`}>
                               {feat.isActive ? t('on') : t('off')}
                             </span>
                           </div>
                         )}
                         <button 
                           onClick={() => removeFeat(idx)}
                           className="p-2 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                           title={t('remove')}
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
           {/* Magic & Spellcasting Section */}
           <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Flame className="w-5 h-5" /> {t('magicSpellcasting')}
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-2">{t('spellAbility')}</label>
                    <select 
                        value={character.spellcastingAbility}
                        onChange={(e) => updateField('spellcastingAbility', e.target.value)}
                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none"
                    >
                        <option value="None">{t('none')}</option>
                        <option value="Intelligence">{t('Intelligence')} (Wizard, Artificer, Arcane Trickster, Eldritch Knight)</option>
                        <option value="Wisdom">{t('Wisdom')} (Cleric, Druid, Ranger, Monk)</option>
                        <option value="Charisma">{t('Charisma')} (Bard, Paladin, Sorcerer, Warlock)</option>
                    </select>
                </div>

                {character.spellcastingAbility !== 'None' && (
                    <>
                        <div className="flex gap-4 p-4 bg-dnd-dark/30 rounded-lg border border-white/5">
                            <div className="flex-1 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold block">{t('spellSaveDC')}</span>
                                <span className="text-2xl font-serif font-bold text-dnd-gold">{calculateSpellSaveDC(character)}</span>
                            </div>
                            <div className="w-px bg-white/10"></div>
                            <div className="flex-1 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold block">{t('attackBonus')}</span>
                                <span className="text-2xl font-serif font-bold text-dnd-gold">+{calculateSpellAttackBonus(character)}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-3 border-b border-white/5 pb-1">{t('spellSlots')}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="text-center">
                                        <label className="text-[10px] text-gray-500 block mb-1">{t('level')} {i + 1}</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            max="10"
                                            value={character.spellSlots[i]}
                                            onChange={(e) => updateSpellSlot(i, parseInt(e.target.value) || 0)}
                                            className="w-full bg-black/40 border border-white/10 rounded text-center text-white focus:border-dnd-gold outline-none py-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-3 border-b border-white/5 pb-1">{t('spellbook')}</h4>
                            
                            <div className="flex gap-2 mb-4 items-end">
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">{t('spellName')}</label>
                                    <input 
                                        type="text" 
                                        value={newSpellName}
                                        onChange={(e) => setNewSpellName(e.target.value)}
                                        placeholder="Fireball"
                                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddSpell()}
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="text-[10px] text-gray-500 block mb-1">{t('level')}</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max="9"
                                        value={newSpellLevel}
                                        onChange={(e) => setNewSpellLevel(parseInt(e.target.value))}
                                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none text-center"
                                    />
                                </div>
                                <button 
                                    onClick={handleAddSpell}
                                    className="bg-dnd-gold text-dnd-dark p-2 rounded hover:bg-yellow-600 mb-[1px]"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {character.spells.length === 0 && (
                                    <p className="text-sm text-gray-500 italic text-center py-2">{t('noSpells')}</p>
                                )}
                                {character.spells.sort((a,b) => a.level - b.level).map((spell, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-black/20 p-2 rounded border border-white/5 group hover:border-dnd-gold/30">
                                        <div className="w-8 h-8 rounded bg-dnd-dark border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                            {spell.level === 0 ? 'C' : spell.level}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-white font-medium">{spell.name}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleSpellPrepared(character.spells.indexOf(spell))}
                                                className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${spell.prepared ? 'bg-indigo-900/50 text-indigo-300 border-indigo-500/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}
                                            >
                                                {spell.prepared ? t('prepared') : t('unprepared')}
                                            </button>
                                            <button 
                                                onClick={() => removeSpell(character.spells.indexOf(spell))}
                                                className="text-gray-600 hover:text-red-400 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
           </div>

          {/* Equipment Section */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                 <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                   <Backpack className="w-5 h-5" /> {t('equipment')}
                 </h3>
                 <button 
                    onClick={handleAddExampleGear}
                    className="text-xs text-dnd-gold bg-dnd-gold/10 px-3 py-1.5 rounded-full border border-dnd-gold/20 hover:bg-dnd-gold hover:text-dnd-dark transition-all flex items-center gap-1"
                 >
                    <Package className="w-3 h-3" /> {t('loadStarter')}
                 </button>
             </div>
             
             {/* Add Item Form */}
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                <div className="grid grid-cols-12 gap-3 mb-3">
                    <div className="col-span-12 md:col-span-5">
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">{t('itemName')}</label>
                        <input 
                            type="text" 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Longsword"
                            className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none text-sm"
                        />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">{t('category')}</label>
                        <select 
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value)}
                            className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none text-sm"
                        >
                            <option value="General">General</option>
                            <option value="Weapon">Weapon</option>
                            <option value="Armor">Armor</option>
                            <option value="Consumable">Consumable</option>
                            <option value="Tool">Tool</option>
                            <option value="Magic Item">Magic Item</option>
                        </select>
                    </div>
                     <div className="col-span-12 md:col-span-3 flex items-end">
                         <button 
                            onClick={handleAddEquipment}
                            className="w-full bg-dnd-gold text-dnd-dark font-bold py-2 rounded hover:bg-yellow-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> {t('addItem')}
                        </button>
                     </div>
                </div>
                <div>
                     <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">{t('description')} (Optional)</label>
                     <input 
                        type="text" 
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="1d8 Slashing, Versatile..."
                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-gray-300 focus:border-dnd-gold outline-none text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddEquipment()}
                     />
                </div>
             </div>

             {/* Inventory List */}
             <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {character.equipment.length === 0 && (
                  <div className="text-gray-500 text-sm italic text-center py-6 bg-black/10 rounded border border-white/5 border-dashed">
                      {t('emptyInventory')}
                  </div>
                )}
                {character.equipment.map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-dnd-dark/40 p-3 rounded border border-white/5 group hover:border-dnd-gold/30 transition-all items-start">
                     {/* Quantity Control */}
                     <div className="flex flex-col items-center w-12">
                         <label className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t('qty')}</label>
                         <input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateEquipmentQuantity(idx, parseInt(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded text-center text-white focus:border-dnd-gold outline-none text-sm py-1"
                         />
                     </div>

                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-gray-200 text-sm">{item.name}</h4>
                                <span className="text-[10px] text-indigo-400 uppercase tracking-wider">{item.category}</span>
                            </div>
                            <button 
                                onClick={() => removeEquipment(idx)}
                                className="p-2 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                                title={t('remove')}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        {item.description && (
                             <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">{item.description}</p>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Backstory */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Scroll className="w-5 h-5" /> {t('backstoryAppearance')}
             </h3>
             
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs text-gray-400 uppercase font-bold">{t('backstory')}</label>
                  <button 
                    onClick={onGenerateBackstory}
                    disabled={isGeneratingBackstory}
                    className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                  >
                    {isGeneratingBackstory ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    {t('aiWriter')}
                  </button>
                </div>
                <textarea 
                  value={character.backstory}
                  onChange={(e) => updateField('backstory', e.target.value)}
                  className="w-full h-32 bg-dnd-dark border border-white/10 rounded p-3 text-sm text-gray-300 focus:border-dnd-gold outline-none resize-none leading-relaxed"
                  placeholder={t('backstoryPlaceholder')}
                />
             </div>
          </div>
        </div>

        {/* Right Column: Stats & Vitals */}
        <div className="space-y-6">

           {/* Vitals Input */}
           <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-6">
                 <h3 className="text-dnd-gold font-serif text-lg flex items-center gap-2">
                   <Heart className="w-5 h-5" /> {t('combatVitals')}
                 </h3>
                 <button 
                   onClick={autoCalculateVitals}
                   className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-dnd-gold transition-colors"
                   title="Recalculate Max HP based on Class, Level & Constitution"
                 >
                   <RefreshCw className="w-3 h-3" /> {t('autoCalc')}
                 </button>
              </div>

              {/* Health Section */}
              <div className="bg-dnd-dark/30 rounded-lg border border-white/5 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3 text-gray-400 uppercase text-xs font-bold">
                      <Activity className="w-3 h-3" /> {t('healthPoints')}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] text-gray-500 uppercase text-center mb-1">{t('current')}</label>
                          <input 
                              type="number" 
                              value={character.currentHitPoints}
                              onChange={(e) => updateField('currentHitPoints', parseInt(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded text-center text-3xl font-bold text-dnd-red focus:border-dnd-red outline-none py-2"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-gray-500 uppercase text-center mb-1">{t('maximum')}</label>
                          <input 
                              type="number" 
                              value={character.hitPoints}
                              onChange={(e) => updateField('hitPoints', parseInt(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded text-center text-2xl font-bold text-gray-300 focus:border-dnd-gold outline-none py-2.5"
                          />
                      </div>
                  </div>
              </div>

              {/* Defense & Dice Section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Armor Class */}
                  <div className="bg-dnd-dark/30 rounded-lg border border-white/5 p-3 text-center">
                       <label className="block text-xs text-gray-400 uppercase font-bold mb-1">{t('armorClass')}</label>
                       <input 
                          type="number" 
                          value={character.armorClass}
                          onChange={(e) => updateField('armorClass', parseInt(e.target.value))}
                          className="w-full bg-transparent border-none text-center text-2xl font-bold text-white focus:ring-0 outline-none p-0"
                        />
                  </div>

                  {/* Hit Dice */}
                  <div className="bg-dnd-dark/30 rounded-lg border border-white/5 p-3 text-center">
                       <label className="block text-xs text-gray-400 uppercase font-bold mb-1">{t('hitDie')}</label>
                       <div className="flex items-center justify-center gap-1">
                          <input 
                             type="number"
                             min="0"
                             max={character.level}
                             value={character.currentHitDice}
                             onChange={(e) => updateField('currentHitDice', parseInt(e.target.value))}
                             className="w-10 bg-black/40 border border-white/10 rounded text-center text-sm font-bold text-white focus:border-dnd-gold outline-none"
                          />
                          <span className="text-gray-500 text-sm">/</span>
                          <span className="text-gray-500 text-xs font-bold">{character.level}d{hitDie}</span>
                       </div>
                  </div>
              </div>
              
              <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-6 flex items-center gap-2">
                <Sword className="w-5 h-5" /> {t('Strength')} & {t('Dexterity')}...
              </h3>
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                 {(Object.keys(character.stats) as Ability[]).map((ability) => (
                   <StatBox 
                      key={ability} 
                      ability={ability} 
                      value={character.stats[ability]} 
                      onChange={(val) => updateStat(ability, val)} 
                   />
                 ))}
              </div>
           </div>
        </div>
      </div>

      {activeModal === 'species' && (
        <SelectionModal 
           title={t('selectSpecies')}
           description={t('selectSpeciesDesc')}
           options={SPECIES_DATA}
           selected={character.species}
           onSelect={(val) => updateField('species', val)}
           onClose={() => setActiveModal(null)}
           icon={<Users className="w-6 h-6" />}
        />
      )}
      {activeModal === 'class' && (
        <SelectionModal 
           title={t('selectClass')}
           description={t('selectClassDesc')}
           options={SUBCLASS_DATA}
           selected={""} 
           onSelect={(val) => {
              const sub = SUBCLASS_DATA.find(s => s.name === val);
              if (sub) {
                  addClassLevel(sub.name, sub.className);
              }
           }}
           onClose={() => setActiveModal(null)}
           icon={<Crown className="w-6 h-6" />}
        />
      )}
      {activeModal === 'background' && (
        <SelectionModal 
           title={t('selectBackground')}
           description={t('selectBackgroundDesc')}
           options={BACKGROUND_DATA}
           selected={character.background}
           onSelect={(val) => updateField('background', val)}
           onClose={() => setActiveModal(null)}
           icon={<Landmark className="w-6 h-6" />}
        />
      )}
      {activeModal === 'alignment' && (
        <SelectionModal 
           title={t('selectAlignment')}
           description={t('selectAlignmentDesc')}
           options={ALIGNMENT_DATA}
           selected={character.alignment}
           onSelect={(val) => updateField('alignment', val)}
           onClose={() => setActiveModal(null)}
           icon={<Scale className="w-6 h-6" />}
        />
      )}
      {activeModal === 'tools' && (
        <SelectionModal 
           title={t('selectTool')}
           description={t('selectToolDesc')}
           options={TOOL_DATA}
           selected={""}
           onSelect={(val) => addToolProficiency(val)}
           onClose={() => setActiveModal(null)}
           icon={<Wrench className="w-6 h-6" />}
        />
      )}
      {activeModal === 'languages' && (
        <SelectionModal 
           title={t('selectLanguage')}
           description={t('selectLanguageDesc')}
           options={LANGUAGE_DATA}
           selected={""}
           onSelect={(val) => addLanguage(val)}
           onClose={() => setActiveModal(null)}
           icon={<Languages className="w-6 h-6" />}
        />
      )}
    </div>
  );
};