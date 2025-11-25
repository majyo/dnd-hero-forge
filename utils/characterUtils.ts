

import { Ability, Character, Feat, ProficiencyLevel, ClassLevelEntry } from '../types';
import { CLASS_HIT_DICE } from '../constants';

export const getModifier = (abilityValue: number) => Math.floor((abilityValue - 10) / 2);

export const getProficiencyBonus = (level: number) => Math.ceil(level / 4) + 1;

export const calculateSkillBonus = (
  skillName: string, 
  ability: Ability, 
  character: Character
) => {
  const abilityScore = character.stats[ability];
  const mod = getModifier(abilityScore);
  const pb = getProficiencyBonus(character.level);
  const level = character.skills[skillName] || 'none';

  if (level === 'expertise') return mod + (pb * 2);
  if (level === 'proficient') return mod + pb;
  return mod;
};

export const calculateMaxHP = (classHistory: ClassLevelEntry[], conValue: number, feats: Feat[]) => {
  const conMod = getModifier(conValue);
  const hasTough = feats.some(f => f.name === "Tough");
  const level = classHistory.length;

  if (level === 0) return 0;

  // Level 1: Max Hit Die + Con
  const firstLevel = classHistory[0];
  let hp = firstLevel.hitDie + conMod;

  // Level 2+: Average Die + Con
  for (let i = 1; i < classHistory.length; i++) {
    const entry = classHistory[i];
    const avgDie = Math.floor(entry.hitDie / 2) + 1;
    hp += avgDie + conMod;
  }

  // Apply Tough Feat
  if (hasTough) {
    hp += level * 2;
  }

  return Math.max(level, hp); // Minimum 1 HP per level effectively
};

export const calculateAC = (primaryClass: string, dexValue: number, conValue: number, wisValue: number) => {
  const dexMod = getModifier(dexValue);
  let ac = 10 + dexMod;

  // Unarmored Defense logic
  // Simple check: if primary class is Barbarian or Monk
  if (primaryClass === 'Barbarian') {
    const conMod = getModifier(conValue);
    ac = 10 + dexMod + conMod;
  } else if (primaryClass === 'Monk') {
    const wisMod = getModifier(wisValue);
    ac = 10 + dexMod + wisMod;
  }

  return ac;
};

export const calculateSpellSaveDC = (character: Character) => {
  if (character.spellcastingAbility === 'None') return 0;
  const abilityScore = character.stats[character.spellcastingAbility as Ability];
  const mod = getModifier(abilityScore);
  const pb = getProficiencyBonus(character.level);
  return 8 + pb + mod;
};

export const calculateSpellAttackBonus = (character: Character) => {
   if (character.spellcastingAbility === 'None') return 0;
   const abilityScore = character.stats[character.spellcastingAbility as Ability];
   const mod = getModifier(abilityScore);
   const pb = getProficiencyBonus(character.level);
   return pb + mod;
};

export const formatClassString = (history: ClassLevelEntry[]): string => {
  if (history.length === 0) return "Commoner 0";
  
  const counts: Record<string, number> = {};
  
  history.forEach(h => {
    counts[h.className] = (counts[h.className] || 0) + 1;
  });

  // Sort by count descending, then name
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${name} ${count}`)
    .join(' / ');
};