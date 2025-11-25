
export enum Ability {
  STR = 'Strength',
  DEX = 'Dexterity',
  CON = 'Constitution',
  INT = 'Intelligence',
  WIS = 'Wisdom',
  CHA = 'Charisma'
}

export interface AbilityScores {
  [Ability.STR]: number;
  [Ability.DEX]: number;
  [Ability.CON]: number;
  [Ability.INT]: number;
  [Ability.WIS]: number;
  [Ability.CHA]: number;
}

export type ProficiencyLevel = 'none' | 'proficient' | 'expertise';

export type FeatureType = 'active' | 'passive';

export interface Feat {
  name: string;
  description: string;
  source: string;
  type: FeatureType;
  isActive?: boolean;
  repeatable?: boolean;
}

export interface Spell {
  name: string;
  level: number;
  prepared: boolean;
}

export interface Character {
  name: string;
  species: string; // Renamed from Race in 2024 rules
  class: string;
  subclass?: string;
  level: number;
  background: string;
  alignment: string;
  stats: AbilityScores;
  skills: Record<string, ProficiencyLevel>;
  feats: Feat[];
  hitPoints: number;
  currentHitPoints: number;
  armorClass: number;
  currentHitDice: number;
  backstory: string;
  appearance: string;
  equipment: string[];
  proficiencies: string[];
  spellcastingAbility: string;
  spellSlots: number[];
  spells: Spell[];
}

export const INITIAL_CHARACTER: Character = {
  name: '',
  species: 'Human',
  class: 'Fighter',
  level: 1,
  background: 'Guard',
  alignment: 'Neutral Good',
  stats: {
    [Ability.STR]: 10,
    [Ability.DEX]: 10,
    [Ability.CON]: 10,
    [Ability.INT]: 10,
    [Ability.WIS]: 10,
    [Ability.CHA]: 10,
  },
  skills: {}, // Empty map implies 'none' for all
  feats: [],
  hitPoints: 10, // Default for Fighter with 10 CON
  currentHitPoints: 10,
  armorClass: 10, // Default for 10 DEX
  currentHitDice: 1,
  backstory: '',
  appearance: '',
  equipment: [],
  proficiencies: [],
  spellcastingAbility: 'None',
  spellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  spells: []
};

export interface AICharacterSuggestion {
  name: string;
  species: string;
  class: string;
  background: string;
  stats: AbilityScores;
  skills: string[]; // AI still returns simple list, we convert to proficient level
  feats?: Feat[];
  shortBackstory: string;
  reasoning: string;
}
