



// D&D 2024 Core Options (Simplified list)

export interface SelectionOption {
  name: string;
  description: string;
}

export const SPECIES_DATA: SelectionOption[] = [
  { name: "Human", description: "Versatile and resilient, humans thrive in almost any environment, known for their adaptability and ambition." },
  { name: "Aasimar", description: "Carrying the spark of the Upper Planes, Aasimar are often champions of good, guided by celestial powers." },
  { name: "Dragonborn", description: "Born of dragons, these proud warriors possess breath weapons and a strong sense of clan honor." },
  { name: "Dwarf", description: "Stout and hardy, dwarves are masters of stone and metal, possessing great endurance and martial skill." },
  { name: "Elf", description: "Magical and long-lived, elves possess keen senses and a deep connection to nature or the fey." },
  { name: "Gnome", description: "Small, inquisitive, and energetic, gnomes delight in discovery, invention, and subtle magic." },
  { name: "Goliath", description: "Towering and powerful, goliaths dwell in high mountain peaks, valuing strength and self-sufficiency." },
  { name: "Halfling", description: "Small and nimble, halflings are known for their luck, bravery, and love of life's simple comforts." },
  { name: "Orc", description: "Strong and relentless, orcs are fierce warriors who value endurance and action over words." },
  { name: "Tiefling", description: "Bearing the mark of an infernal heritage, tieflings possess innate magic and often face prejudice with defiance." }
];

export const SPECIES_LIST = SPECIES_DATA.map(s => s.name);

export const CLASS_DATA: SelectionOption[] = [
  { name: "Barbarian", description: "A fierce warrior of primitive background who can enter a battle rage." },
  { name: "Bard", description: "An inspiring magician whose power echoes the music of creation." },
  { name: "Cleric", description: "A priestly champion who wields divine magic in service of a higher power." },
  { name: "Druid", description: "A priest of the Old Faith, wielding the powers of nature and adopting animal forms." },
  { name: "Fighter", description: "A master of martial combat, skilled with a variety of weapons and armor." },
  { name: "Monk", description: "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection." },
  { name: "Paladin", description: "A holy warrior bound to a sacred oath." },
  { name: "Ranger", description: "A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization." },
  { name: "Rogue", description: "A scoundrel who uses stealth and trickery to overcome obstacles and enemies." },
  { name: "Sorcerer", description: "A spellcaster who draws on inherent magic from a gift or bloodline." },
  { name: "Warlock", description: "A practitioner of magic who has derived a pact with an extraplanar entity." },
  { name: "Wizard", description: "A scholarly magic-user capable of manipulating the structures of reality." }
];

export const CLASS_LIST = CLASS_DATA.map(c => c.name);

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

export const BACKGROUND_DATA: SelectionOption[] = [
  { name: "Acolyte", description: "You spent your formative years in a temple, performing sacred rites and studying religious lore." },
  { name: "Artisan", description: "You are a master of a specific craft, creating items of value and beauty with your hands." },
  { name: "Charlatan", description: "You know how to manipulate others, using deception and tricks to get what you want." },
  { name: "Criminal", description: "You have a history of breaking the law and surviving on the wrong side of society." },
  { name: "Entertainer", description: "You thrive in front of an audience, using your talents to captivate and inspire." },
  { name: "Farmer", description: "You grew up working the land, developing strong roots and a connection to nature's cycles." },
  { name: "Guard", description: "You served in a militia or city watch, trained to protect your community and enforce order." },
  { name: "Guide", description: "You are at home in the wilderness, skilled at navigating and surviving in the wild." },
  { name: "Hermit", description: "You lived in seclusion, seeking spiritual enlightenment or hiding from society." },
  { name: "Merchant", description: "You know the value of things and people, making your living through trade and negotiation." },
  { name: "Noble", description: "You were born into privilege, understanding high society and the responsibilities of power." },
  { name: "Sage", description: "You are a scholar, having spent years studying lore, history, or the arcane arts." },
  { name: "Sailor", description: "You are at home on the open sea, skilled in the operations of a ship and weathering storms." },
  { name: "Scribe", description: "You are a master of the written word, recording history, laws, or arcane knowledge." },
  { name: "Soldier", description: "You have trained in the arts of war, serving in an army or mercenary company." },
  { name: "Wayfarer", description: "You are a wanderer, traveling from place to place and collecting stories and oddities." }
];

export const BACKGROUND_LIST = BACKGROUND_DATA.map(b => b.name);

export const ALIGNMENT_DATA: SelectionOption[] = [
  { name: "Lawful Good", description: "You act as a good person is expected or required to act, upholding law and protecting the innocent." },
  { name: "Neutral Good", description: "You do the best you can to help others according to your needs, without strong bias for or against order." },
  { name: "Chaotic Good", description: "You act as your conscience directs, with little regard for what others expect." },
  { name: "Lawful Neutral", description: "You act in accordance with law, tradition, or personal codes. Order is paramount." },
  { name: "True Neutral", description: "You prefer to steer clear of moral questions and don't take sides, doing what seems best at the time." },
  { name: "Chaotic Neutral", description: "You follow your whims, valuing your own freedom above all else." },
  { name: "Lawful Evil", description: "You methodically take what you want within the limits of a code of tradition, loyalty, or order." },
  { name: "Neutral Evil", description: "You do whatever you can get away with, without compassion or qualms." },
  { name: "Chaotic Evil", description: "You act with arbitrary violence, spurred by your greed, hatred, or bloodlust." }
];

export const ALIGNMENTS = ALIGNMENT_DATA.map(a => a.name);

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

export const EXAMPLE_EQUIPMENT = [
  { name: "Longsword", category: "Weapon", description: "1d8 slashing damage, Versatile (1d10).", quantity: 1 },
  { name: "Chain Mail", category: "Armor", description: "AC 16, Strength 13 required, Stealth disadvantage.", quantity: 1 },
  { name: "Healing Potion", category: "Consumable", description: "Restores 2d4 + 2 hit points.", quantity: 2 },
  { name: "Explorer's Pack", category: "Adventuring Gear", description: "Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.", quantity: 1 },
  { name: "Shield", category: "Armor", description: "+2 to Armor Class.", quantity: 1 }
];