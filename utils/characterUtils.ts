
import { Ability, Character, Feat, ProficiencyLevel } from '../types';
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

export const calculateMaxHP = (charClass: string, level: number, conValue: number, feats: Feat[]) => {
  const hitDie = CLASS_HIT_DICE[charClass] || 8;
  const conMod = getModifier(conValue);
  const hasTough = feats.some(f => f.name === "Tough");
  
  // Level 1 HP
  let hp = hitDie + conMod;
  
  // Levels 2+ (using average)
  if (level > 1) {
    const avgDie = Math.floor(hitDie / 2) + 1;
    hp += (level - 1) * (avgDie + conMod);
  }

  // Apply Tough Feat
  if (hasTough) {
    hp += level * 2;
  }

  return Math.max(level, hp); // Minimum 1 HP per level effectively
};

export const calculateAC = (charClass: string, dexValue: number, conValue: number, wisValue: number) => {
  const dexMod = getModifier(dexValue);
  let ac = 10 + dexMod;

  // Unarmored Defense logic
  if (charClass === 'Barbarian') {
    const conMod = getModifier(conValue);
    ac = 10 + dexMod + conMod;
  } else if (charClass === 'Monk') {
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
