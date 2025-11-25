
import React, { useState } from 'react';
import { Shield, Scroll, Sword, Sparkles, RefreshCw, BookOpen, Circle, Disc, Trophy, Trash2, Plus, Heart, X, Zap, Backpack, Flame, Activity, Check, Users, Scale, Landmark, ChevronRight } from 'lucide-react';
import { Ability, Character, ProficiencyLevel, Spell } from '../types';
import { SPECIES_LIST, CLASS_LIST, BACKGROUND_LIST, ALIGNMENTS, SKILL_DATA, CLASS_HIT_DICE } from '../constants';
import { StatBox } from './StatBox';
import { SelectionModal } from './SelectionModal';
import { getProficiencyBonus, calculateSkillBonus, calculateSpellSaveDC, calculateSpellAttackBonus } from '../utils/characterUtils';

interface CharacterEditorProps {
  character: Character;
  updateField: (field: keyof Character, value: any) => void;
  updateStat: (ability: Ability, value: number) => void;
  setSkillLevel: (skillName: string, level: ProficiencyLevel) => void;
  removeFeat: (index: number) => void;
  toggleFeatureActive: (index: number) => void;
  addEquipment: (item: string) => void;
  removeEquipment: (index: number) => void;
  autoCalculateVitals: () => void;
  addSpell: (spell: Spell) => void;
  removeSpell: (index: number) => void;
  toggleSpellPrepared: (index: number) => void;
  updateSpellSlot: (level: number, max: number) => void;
  
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
  setSkillLevel,
  removeFeat,
  toggleFeatureActive,
  addEquipment,
  removeEquipment,
  autoCalculateVitals,
  addSpell,
  removeSpell,
  toggleSpellPrepared,
  updateSpellSlot,
  aiPrompt,
  setAiPrompt,
  isGenerating,
  onQuickBuild,
  isGeneratingBackstory,
  onGenerateBackstory,
  onSuggestName,
  onOpenFeatModal
}) => {
  const [newItem, setNewItem] = useState('');
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellLevel, setNewSpellLevel] = useState(0);
  const [activeModal, setActiveModal] = useState<'species' | 'background' | 'alignment' | null>(null);

  const hitDie = CLASS_HIT_DICE[character.class] || 8;

  const handleAddEquipment = () => {
    addEquipment(newItem);
    setNewItem('');
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
          <h2 className="font-serif font-bold tracking-wide text-sm uppercase">Gemini AI Quick Build</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="e.g., 'A sneaky Halfling rogue who steals from the rich' or 'A paladin struggling with their oath'"
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
            {isGenerating ? 'Forging...' : 'Generate'}
          </button>
        </div>
        <p className="text-xs text-indigo-300/60 mt-2 ml-1">
          Powered by Google Gemini 2.5 Flash. Generates Stats, Skills, Feats, and Backstory automatically.
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
          
          {/* Top Bar: Name, Level, Class */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Shield className="w-5 h-5" /> Core Identity
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-1 md:col-span-2">
                 <label className="text-xs text-gray-400 uppercase font-bold">Character Name</label>
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
                      title="Suggest Name"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-xs text-gray-400 uppercase font-bold">Level</label>
                 <input 
                    type="number" 
                    min="1" max="20"
                    value={character.level}
                    onChange={(e) => updateField('level', parseInt(e.target.value))}
                    className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none"
                 />
               </div>

               <div className="space-y-1 md:col-span-3">
                 <label className="text-xs text-gray-400 uppercase font-bold">Class</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select 
                        value={character.class}
                        onChange={(e) => updateField('class', e.target.value)}
                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none appearance-none"
                    >
                    {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded border border-white/5 text-gray-400 text-sm">
                        <Heart className="w-3 h-3 text-dnd-red" />
                        <span>Hit Die: <span className="text-white font-bold">d{hitDie}</span></span>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Origin Section (Species, Background, Alignment) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {renderSelectionCard("Species", character.species, <Users className="w-5 h-5"/>, () => setActiveModal('species'))}
             {renderSelectionCard("Background", character.background, <Landmark className="w-5 h-5"/>, () => setActiveModal('background'))}
             {renderSelectionCard("Alignment", character.alignment, <Scale className="w-5 h-5"/>, () => setActiveModal('alignment'))}
          </div>

          {/* Skills Section */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center justify-between">
               <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Skill Proficiencies</div>
               <div className="text-xs text-gray-500 font-sans font-normal">
                 PB: <span className="text-dnd-gold">+{getProficiencyBonus(character.level)}</span>
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
                 <Zap className="w-5 h-5" /> Features & Traits
               </h3>
               <button 
                 onClick={onOpenFeatModal}
                 className="bg-dnd-gold text-dnd-dark font-bold px-4 py-1.5 rounded hover:bg-yellow-600 flex items-center gap-2 text-sm transition-colors shadow-lg shadow-dnd-gold/10"
               >
                 <Plus className="w-4 h-4" /> Add Feature
               </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {character.feats.length === 0 && (
                 <div className="text-center py-8 border border-dashed border-white/10 rounded-lg bg-black/20">
                   <p className="text-gray-500 italic">No features added yet.</p>
                   <p className="text-xs text-gray-600 mt-1">Click "Add Feature" to browse abilities.</p>
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
                               <span className="text-[10px] text-orange-400 uppercase border border-orange-900 bg-orange-950/30 px-1.5 rounded tracking-wider">Active</span>
                             )}
                             {feat.repeatable && (
                               <span className="text-[10px] text-purple-400 uppercase border border-purple-900 bg-purple-950/30 px-1.5 rounded tracking-wider">Repeatable</span>
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
                               {feat.isActive ? 'On' : 'Off'}
                             </span>
                           </div>
                         )}
                         <button 
                           onClick={() => removeFeat(idx)}
                           className="p-2 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                           title="Remove Feature"
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
               <Flame className="w-5 h-5" /> Magic & Spellcasting
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Spellcasting Ability</label>
                    <select 
                        value={character.spellcastingAbility}
                        onChange={(e) => updateField('spellcastingAbility', e.target.value)}
                        className="w-full bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none"
                    >
                        <option value="None">None</option>
                        <option value="Intelligence">Intelligence (Wizard, Artificer, Arcane Trickster, Eldritch Knight)</option>
                        <option value="Wisdom">Wisdom (Cleric, Druid, Ranger, Monk)</option>
                        <option value="Charisma">Charisma (Bard, Paladin, Sorcerer, Warlock)</option>
                    </select>
                </div>

                {character.spellcastingAbility !== 'None' && (
                    <>
                        <div className="flex gap-4 p-4 bg-dnd-dark/30 rounded-lg border border-white/5">
                            <div className="flex-1 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold block">Spell Save DC</span>
                                <span className="text-2xl font-serif font-bold text-dnd-gold">{calculateSpellSaveDC(character)}</span>
                            </div>
                            <div className="w-px bg-white/10"></div>
                            <div className="flex-1 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold block">Attack Bonus</span>
                                <span className="text-2xl font-serif font-bold text-dnd-gold">+{calculateSpellAttackBonus(character)}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-3 border-b border-white/5 pb-1">Spell Slots (Max)</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="text-center">
                                        <label className="text-[10px] text-gray-500 block mb-1">Lvl {i + 1}</label>
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
                            <h4 className="text-sm font-bold text-gray-300 mb-3 border-b border-white/5 pb-1">Spellbook</h4>
                            
                            <div className="flex gap-2 mb-4 items-end">
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">Spell Name</label>
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
                                    <label className="text-[10px] text-gray-500 block mb-1">Level</label>
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
                                    <p className="text-sm text-gray-500 italic text-center py-2">No spells added.</p>
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
                                                {spell.prepared ? 'Prepared' : 'Unprepared'}
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
             <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Backpack className="w-5 h-5" /> Equipment
             </h3>
             
             <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEquipment()}
                  placeholder="Add item (e.g. Longsword, Rope, 50gp)"
                  className="flex-1 bg-dnd-dark border border-white/10 rounded px-3 py-2 text-white focus:border-dnd-gold outline-none placeholder-gray-600"
                />
                <button 
                  onClick={handleAddEquipment}
                  className="bg-dnd-gold text-dnd-dark font-bold px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {character.equipment.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No equipment added.</p>
                )}
                {character.equipment.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5 group hover:border-dnd-gold/30 transition-colors">
                     <span className="text-sm text-gray-300">{item}</span>
                     <button 
                       onClick={() => removeEquipment(idx)}
                       className="text-gray-600 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all"
                       title="Remove Item"
                     >
                       <X className="w-4 h-4" />
                     </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Backstory */}
          <div className="bg-dnd-slate/50 border border-white/5 rounded-xl p-6">
             <h3 className="text-dnd-gold font-serif text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
               <Scroll className="w-5 h-5" /> Backstory & Appearance
             </h3>
             
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs text-gray-400 uppercase font-bold">Backstory</label>
                  <button 
                    onClick={onGenerateBackstory}
                    disabled={isGeneratingBackstory}
                    className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                  >
                    {isGeneratingBackstory ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    AI Writer
                  </button>
                </div>
                <textarea 
                  value={character.backstory}
                  onChange={(e) => updateField('backstory', e.target.value)}
                  className="w-full h-32 bg-dnd-dark border border-white/10 rounded p-3 text-sm text-gray-300 focus:border-dnd-gold outline-none resize-none leading-relaxed"
                  placeholder="Describe your character's past..."
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
                   <Heart className="w-5 h-5" /> Combat Vitals
                 </h3>
                 <button 
                   onClick={autoCalculateVitals}
                   className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-dnd-gold transition-colors"
                   title="Recalculate Max HP based on Class, Level & Constitution"
                 >
                   <RefreshCw className="w-3 h-3" /> Auto Calc Max
                 </button>
              </div>

              {/* Health Section */}
              <div className="bg-dnd-dark/30 rounded-lg border border-white/5 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3 text-gray-400 uppercase text-xs font-bold">
                      <Activity className="w-3 h-3" /> Health Points
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] text-gray-500 uppercase text-center mb-1">Current</label>
                          <input 
                              type="number" 
                              value={character.currentHitPoints}
                              onChange={(e) => updateField('currentHitPoints', parseInt(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded text-center text-3xl font-bold text-dnd-red focus:border-dnd-red outline-none py-2"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-gray-500 uppercase text-center mb-1">Maximum</label>
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
                       <label className="block text-xs text-gray-400 uppercase font-bold mb-1">AC</label>
                       <input 
                          type="number" 
                          value={character.armorClass}
                          onChange={(e) => updateField('armorClass', parseInt(e.target.value))}
                          className="w-full bg-transparent border-none text-center text-2xl font-bold text-white focus:ring-0 outline-none p-0"
                        />
                  </div>

                  {/* Hit Dice */}
                  <div className="bg-dnd-dark/30 rounded-lg border border-white/5 p-3 text-center">
                       <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Hit Dice</label>
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
                <Sword className="w-5 h-5" /> Ability Scores
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
           title="Select Species"
           description="Choose your character's species, determining their innate traits and ancestry."
           options={SPECIES_LIST}
           selected={character.species}
           onSelect={(val) => updateField('species', val)}
           onClose={() => setActiveModal(null)}
           icon={<Users className="w-6 h-6" />}
        />
      )}
      {activeModal === 'background' && (
        <SelectionModal 
           title="Select Background"
           description="Your background reveals where you came from and how you became an adventurer."
           options={BACKGROUND_LIST}
           selected={character.background}
           onSelect={(val) => updateField('background', val)}
           onClose={() => setActiveModal(null)}
           icon={<Landmark className="w-6 h-6" />}
        />
      )}
      {activeModal === 'alignment' && (
        <SelectionModal 
           title="Select Alignment"
           description="Alignment matches your character's moral compass and view of the world."
           options={ALIGNMENTS}
           selected={character.alignment}
           onSelect={(val) => updateField('alignment', val)}
           onClose={() => setActiveModal(null)}
           icon={<Scale className="w-6 h-6" />}
        />
      )}
    </div>
  );
};
