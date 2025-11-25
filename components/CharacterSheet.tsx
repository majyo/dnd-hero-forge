
import React from 'react';
import { Download, Flame, Shield, Activity, Heart } from 'lucide-react';
import { Character, Ability } from '../types';
import { SKILL_DATA, CLASS_HIT_DICE } from '../constants';
import { getModifier, getProficiencyBonus, calculateSkillBonus, calculateSpellSaveDC, calculateSpellAttackBonus } from '../utils/characterUtils';

interface CharacterSheetProps {
  character: Character;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  const proficiencyBonus = getProficiencyBonus(character.level);
  const hitDie = CLASS_HIT_DICE[character.class] || 8;
  const isSpellcaster = character.spellcastingAbility !== 'None';
  const saveDC = calculateSpellSaveDC(character);
  const attackBonus = calculateSpellAttackBonus(character);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-dnd-paper text-dnd-dark rounded-sm shadow-2xl overflow-hidden relative print:shadow-none">
        {/* Decorative borders */}
        <div className="absolute top-0 left-0 w-full h-2 bg-dnd-red" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-dnd-red" />
        
        {/* Sheet Header */}
        <div className="p-8 border-b-2 border-dnd-red/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-dnd-red uppercase tracking-widest">{character.name || "Unnamed Hero"}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
              <span>{character.species}</span>
              <span className="w-1 h-1 bg-dnd-red rounded-full self-center" />
              <span>{character.class} {character.level}</span>
              <span className="w-1 h-1 bg-dnd-red rounded-full self-center" />
              <span>{character.background}</span>
              <span className="w-1 h-1 bg-dnd-red rounded-full self-center" />
              <span>{character.alignment}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block border-4 border-dnd-gold p-3 rounded-full w-24 h-24 flex flex-col items-center justify-center bg-white shadow-inner">
               <span className="text-xs uppercase font-bold text-gray-500">Level</span>
               <span className="text-4xl font-serif font-bold text-dnd-red">{character.level}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
           {/* Left Sidebar: Stats & Skills */}
           <div className="md:col-span-4 bg-gray-100/50 p-6 border-r border-dnd-red/10 flex flex-col gap-6">
              {/* Ability Scores */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                {(Object.keys(character.stats) as Ability[]).map((ability) => {
                  const mod = Math.floor((character.stats[ability] - 10) / 2);
                  return (
                    <div key={ability} className="flex flex-col items-center bg-white border border-gray-300 rounded-xl p-3 shadow-sm">
                        <span className="text-xs font-bold uppercase text-gray-500">{ability}</span>
                        <span className="text-3xl font-bold text-dnd-red font-serif my-1">{mod >= 0 ? '+' : ''}{mod}</span>
                        <div className="bg-gray-200 rounded-full px-3 py-0.5 text-xs font-bold text-gray-700 border border-gray-300">
                          {character.stats[ability]}
                        </div>
                    </div>
                  );
                })}
              </div>

              {/* Skills List */}
              <div className="mt-4">
                 <h3 className="font-serif font-bold text-dnd-red uppercase border-b border-gray-300 pb-1 mb-2">Skills</h3>
                 <div className="space-y-1.5">
                   {SKILL_DATA.map(skill => {
                      const level = character.skills[skill.name] || 'none';
                      const totalMod = calculateSkillBonus(skill.name, skill.ability as Ability, character);
                      
                      let icon = <div className="w-3 h-3 rounded-full border border-gray-400 mr-2 bg-white" />; // None
                      if (level === 'proficient') icon = <div className="w-3 h-3 rounded-full border border-dnd-dark mr-2 bg-dnd-dark" />; // Proficient
                      if (level === 'expertise') icon = <div className="w-3 h-3 rounded-full border border-dnd-dark mr-2 bg-dnd-dark ring-1 ring-offset-1 ring-dnd-dark" />; // Expertise

                      return (
                        <div key={skill.name} className="flex items-center text-sm">
                           {icon}
                           <span className="font-bold w-8 text-right mr-2 text-gray-700">{totalMod >= 0 ? '+' : ''}{totalMod}</span>
                           <span className={`${level !== 'none' ? 'font-bold text-dnd-dark' : 'text-gray-600'}`}>{skill.name}</span>
                           <span className="ml-auto text-[10px] uppercase text-gray-400">{skill.ability.substring(0, 3)}</span>
                        </div>
                      )
                   })}
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <div className="md:col-span-8 p-8 space-y-8">
              
              {/* Vitals - Redesigned */}
              <div className="flex flex-wrap gap-6 justify-center mb-8">
                  {/* Defense Group */}
                  <div className="flex gap-4">
                      <div className="border-2 border-gray-300 rounded-lg p-3 text-center w-28 bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400 opacity-50"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Armor Class</span>
                        <div className="flex items-center justify-center h-10">
                            <Shield className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-3xl font-serif font-bold text-dnd-dark">{character.armorClass}</span>
                        </div>
                      </div>

                      <div className="border-2 border-gray-300 rounded-lg p-3 text-center w-24 bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400 opacity-50"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Initiative</span>
                        <div className="flex items-center justify-center h-10">
                            <span className="text-3xl font-serif font-bold text-gray-800">
                                {Math.floor((character.stats.Dexterity - 10) / 2) >= 0 ? '+' : ''}
                                {Math.floor((character.stats.Dexterity - 10) / 2)}
                            </span>
                        </div>
                      </div>

                      <div className="border-2 border-gray-300 rounded-lg p-3 text-center w-24 bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400 opacity-50"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Speed</span>
                        <div className="flex items-center justify-center h-10">
                            <span className="text-3xl font-serif font-bold text-gray-800">30</span>
                            <span className="text-xs text-gray-400 ml-1 self-end mb-2">ft</span>
                        </div>
                      </div>
                  </div>

                  {/* Health Group */}
                  <div className="flex gap-4">
                      <div className="border-2 border-dnd-red/30 rounded-lg p-3 w-48 bg-white shadow-sm relative overflow-hidden flex flex-col justify-between">
                         <div className="absolute top-0 left-0 w-full h-1 bg-dnd-red"></div>
                         <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-gray-400 uppercase">Hit Points</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Max: {character.hitPoints}</span>
                         </div>
                         <div className="flex items-end justify-center">
                             <span className="text-4xl font-serif font-bold text-dnd-red">{character.currentHitPoints}</span>
                             <span className="text-lg text-gray-400 ml-2 mb-1">/ {character.hitPoints}</span>
                         </div>
                      </div>

                      <div className="border-2 border-gray-300 rounded-lg p-3 w-32 bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-dnd-gold opacity-50"></div>
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-gray-400 uppercase">Hit Dice</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase">d{hitDie}</span>
                        </div>
                        <div className="flex items-end justify-center h-10">
                             <span className="text-3xl font-serif font-bold text-gray-800">{character.currentHitDice}</span>
                             <span className="text-sm text-gray-400 ml-1 mb-1 self-end">/ {character.level}</span>
                        </div>
                      </div>
                  </div>
              </div>

              {/* Proficiency Bonus & Passive Perception */}
              <div className="grid grid-cols-2 gap-8">
                 <div className="flex items-center gap-4 border-b border-gray-300 pb-2">
                    <div className="text-xl font-bold font-serif text-dnd-red">+{proficiencyBonus}</div>
                    <div className="text-sm font-bold uppercase text-gray-600">Proficiency Bonus</div>
                 </div>
                 <div className="flex items-center gap-4 border-b border-gray-300 pb-2">
                    <div className="text-xl font-bold font-serif text-dnd-red">
                      {10 + getModifier(character.stats.Wisdom) + (character.skills["Perception"] === 'proficient' ? proficiencyBonus : character.skills["Perception"] === 'expertise' ? proficiencyBonus * 2 : 0)}
                    </div>
                    <div className="text-sm font-bold uppercase text-gray-600">Passive Perception</div>
                 </div>
              </div>

               {/* Feats & Features Section */}
              {character.feats.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-serif font-bold text-xl text-dnd-red border-b-2 border-dnd-red mb-4">Features & Traits</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {character.feats.map((feat, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-dnd-dark text-lg">{feat.name}</span>
                          <span className="text-[10px] uppercase text-gray-500 border border-gray-300 px-1.5 rounded bg-white">{feat.source}</span>
                          {feat.isActive && <span className="text-[10px] uppercase text-green-600 font-bold tracking-wider">• Active</span>}
                          {feat.repeatable && <span className="text-[10px] uppercase text-purple-600 font-bold tracking-wider border border-purple-200 px-1.5 rounded bg-purple-50">Repeatable</span>}
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed block">{feat.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spellcasting Section */}
              {isSpellcaster && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 border-b-2 border-dnd-red mb-4 pb-2">
                        <h3 className="font-serif font-bold text-xl text-dnd-red">Spellcasting</h3>
                        <span className="text-xs uppercase font-bold text-gray-500 border border-gray-300 px-2 py-0.5 rounded bg-white">
                            {character.spellcastingAbility}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                            <span className="text-xs uppercase font-bold text-gray-500 block">Spell Save DC</span>
                            <span className="text-3xl font-serif font-bold text-dnd-dark">{saveDC}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                            <span className="text-xs uppercase font-bold text-gray-500 block">Spell Attack</span>
                            <span className="text-3xl font-serif font-bold text-dnd-dark">+{attackBonus}</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center flex flex-col justify-center">
                           <span className="text-xs uppercase font-bold text-gray-500 block">Ability Mod</span>
                           <span className="text-xl font-serif font-bold text-gray-700">
                               {getModifier(character.stats[character.spellcastingAbility as Ability]) >= 0 ? '+' : ''}
                               {getModifier(character.stats[character.spellcastingAbility as Ability])}
                           </span>
                        </div>
                    </div>

                    {/* Spell Slots & Spells */}
                    <div className="space-y-6">
                        {/* Cantrips */}
                        {character.spells.filter(s => s.level === 0).length > 0 && (
                            <div>
                                <h4 className="font-bold text-dnd-dark border-b border-gray-300 mb-2">Cantrips (0 Level)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {character.spells.filter(s => s.level === 0).map((spell, i) => (
                                        <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                                            <span>{spell.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Leveled Spells */}
                        {Array.from({length: 9}).map((_, i) => {
                            const level = i + 1;
                            const slots = character.spellSlots[i];
                            const spells = character.spells.filter(s => s.level === level);
                            
                            if (slots === 0 && spells.length === 0) return null;

                            return (
                                <div key={level}>
                                    <div className="flex justify-between items-end border-b border-gray-300 mb-2">
                                        <h4 className="font-bold text-dnd-dark">Level {level}</h4>
                                        <div className="flex items-center gap-2">
                                           <span className="text-xs text-gray-500 uppercase">Slots</span>
                                           <div className="flex gap-1">
                                               {Array.from({length: slots}).map((_, j) => (
                                                   <div key={j} className="w-4 h-4 border border-gray-400 rounded-sm bg-white" />
                                               ))}
                                           </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {spells.length === 0 ? <span className="text-xs text-gray-400 italic">No spells known/prepared</span> : spells.map((spell, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded border border-gray-200">
                                                <span>{spell.name}</span>
                                                {spell.prepared && <span className="text-[10px] uppercase font-bold text-dnd-red bg-red-50 px-1 rounded border border-red-100">Prep</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
              )}

              {/* Equipment Section */}
              {character.equipment.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-serif font-bold text-xl text-dnd-red border-b-2 border-dnd-red mb-4">Equipment</h3>
                  <ul className="list-disc list-inside columns-1 md:columns-2 gap-8 text-gray-800 text-sm">
                    {character.equipment.map((item, idx) => (
                      <li key={idx} className="mb-1 break-inside-avoid">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Backstory Section */}
              <div className="mt-8">
                <h3 className="font-serif font-bold text-xl text-dnd-red border-b-2 border-dnd-red mb-4">Backstory & Personality</h3>
                <div className="text-gray-800 leading-relaxed font-serif text-justify whitespace-pre-wrap">
                  {character.backstory || "No backstory written yet."}
                </div>
              </div>

              {/* Footer Actions (Print) */}
              <div className="pt-12 flex justify-end print:hidden">
                 <button 
                   onClick={() => window.print()}
                   className="flex items-center gap-2 text-dnd-red font-bold hover:text-red-800"
                 >
                   <Download className="w-5 h-5" /> Print Character Sheet
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
