



// D&D 2024 Core Options (Simplified list)

export const SPECIES_LIST = [
  "Human",
  "Aasimar",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Goliath",
  "Halfling",
  "Orc",
  "Tiefling"
];

export const CLASS_LIST = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard"
];

export const CLASS_HIT_DICE: Record<string, number> = {
  "Barbarian": 12,
  "Bard": 8,
  "Cleric": 8,
  "Druid": 8,
  "Fighter": 10,
  "Monk": 8,
  "Paladin": 10,
  "Ranger": 10,
  "Rogue": 8,
  "Sorcerer": 6,
  "Warlock": 8,
  "Wizard": 6
};

export const BACKGROUND_LIST = [
  "Acolyte",
  "Artisan",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Farmer",
  "Guard",
  "Guide",
  "Hermit",
  "Merchant",
  "Noble",
  "Sage",
  "Sailor",
  "Scribe",
  "Soldier",
  "Wayfarer"
];

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

export const SKILL_DATA = [
  { name: 'Acrobatics', ability: 'Dexterity' },
  { name: 'Animal Handling', ability: 'Wisdom' },
  { name: 'Arcana', ability: 'Intelligence' },
  { name: 'Athletics', ability: 'Strength' },
  { name: 'Deception', ability: 'Charisma' },
  { name: 'History', ability: 'Intelligence' },
  { name: 'Insight', ability: 'Wisdom' },
  { name: 'Intimidation', ability: 'Charisma' },
  { name: 'Investigation', ability: 'Intelligence' },
  { name: 'Medicine', ability: 'Wisdom' },
  { name: 'Nature', ability: 'Intelligence' },
  { name: 'Perception', ability: 'Wisdom' },
  { name: 'Performance', ability: 'Charisma' },
  { name: 'Persuasion', ability: 'Charisma' },
  { name: 'Religion', ability: 'Intelligence' },
  { name: 'Sleight of Hand', ability: 'Dexterity' },
  { name: 'Stealth', ability: 'Dexterity' },
  { name: 'Survival', ability: 'Wisdom' }
];

export const FEATURES_DATA = [
  { 
    name: "Alert", 
    description: "You have proficiency in Initiative. You can swap your Initiative with a willing ally at the start of combat.",
    source: "Origin Feat",
    type: "passive",
    repeatable: false
  },
  { 
    name: "Musician", 
    description: "You gain proficiency with three musical instruments. You can grant Inspiration to allies after a Short or Long Rest.",
    source: "Origin Feat",
    type: "active",
    repeatable: false
  },
  { 
    name: "Tough", 
    description: "Your Hit Point maximum increases by an amount equal to twice your character level.",
    source: "Origin Feat",
    type: "passive",
    repeatable: false
  },
  {
    name: "Healer",
    description: "Reroll 1s on healing dice. Use a Healer's Kit to restore HP equal to a roll of your Hit Die + PB.",
    source: "Origin Feat",
    type: "active",
    repeatable: false
  },
  {
    name: "Lucky",
    description: "You have Luck Points equal to your PB. Spend a point to gain Advantage or impose Disadvantage.",
    source: "Origin Feat",
    type: "active",
    repeatable: false
  },
  {
    name: "Ability Score Improvement",
    description: "You increase one Ability Score by 2, or two Ability Scores by 1 (up to 20).",
    source: "General Feat",
    type: "passive",
    repeatable: true
  },
  {
    name: "Rage",
    description: "Enter a rage for 1 minute (10 rounds). You gain advantage on STR checks/saves, resistance to bludgeoning, piercing, and slashing damage, and +2 rage damage.",
    source: "Barbarian Class",
    type: "active",
    repeatable: false
  },
  {
    name: "Bardic Inspiration",
    description: "Use a Bonus Action to give a creature a Bardic Inspiration die.",
    source: "Bard Class",
    type: "active",
    repeatable: false
  },
  {
    name: "Darkvision",
    description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
    source: "Species Trait",
    type: "passive",
    repeatable: false
  },
  {
    name: "Second Wind",
    description: "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.",
    source: "Fighter Class",
    type: "active",
    repeatable: false
  }
];