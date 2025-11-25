
import { useState } from 'react';
import { Character, INITIAL_CHARACTER, Ability, ProficiencyLevel, Feat, Spell } from '../types';
import { calculateMaxHP, calculateAC } from '../utils/characterUtils';

export const useCharacter = () => {
  const [character, setCharacter] = useState<Character>(INITIAL_CHARACTER);

  const updateStat = (ability: Ability, value: number) => {
    setCharacter(prev => ({
      ...prev,
      stats: { ...prev.stats, [ability]: value }
    }));
  };

  const updateField = (field: keyof Character, value: any) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const setSkillLevel = (skillName: string, level: ProficiencyLevel) => {
    setCharacter(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillName]: level
      }
    }));
  };

  const addFeat = (feat: Feat) => {
    // Prevent duplicates based on name unless repeatable
    const isPresent = character.feats.some(f => f.name === feat.name);
    
    if (feat.repeatable || !isPresent) {
      setCharacter(prev => ({
        ...prev,
        feats: [...prev.feats, { ...feat, isActive: false }]
      }));
    }
  };

  const removeFeat = (index: number) => {
    setCharacter(prev => ({
      ...prev,
      feats: prev.feats.filter((_, i) => i !== index)
    }));
  };

  const toggleFeatureActive = (index: number) => {
    setCharacter(prev => {
      const newFeats = [...prev.feats];
      if (newFeats[index].type === 'active') {
        newFeats[index] = { ...newFeats[index], isActive: !newFeats[index].isActive };
      }
      return { ...prev, feats: newFeats };
    });
  };

  const addEquipment = (itemName: string) => {
    if (!itemName.trim()) return;
    setCharacter(prev => ({
      ...prev,
      equipment: [...prev.equipment, itemName.trim()]
    }));
  };

  const removeEquipment = (index: number) => {
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const autoCalculateVitals = () => {
    const newHP = calculateMaxHP(character.class, character.level, character.stats.Constitution, character.feats);
    const newAC = calculateAC(character.class, character.stats.Dexterity, character.stats.Constitution, character.stats.Wisdom);
    
    setCharacter(prev => ({
      ...prev,
      hitPoints: newHP,
      armorClass: newAC
    }));
  };

  const addSpell = (spell: Spell) => {
    setCharacter(prev => ({
      ...prev,
      spells: [...prev.spells, spell]
    }));
  };

  const removeSpell = (index: number) => {
    setCharacter(prev => ({
      ...prev,
      spells: prev.spells.filter((_, i) => i !== index)
    }));
  };

  const toggleSpellPrepared = (index: number) => {
    setCharacter(prev => {
        const newSpells = [...prev.spells];
        newSpells[index] = { ...newSpells[index], prepared: !newSpells[index].prepared };
        return { ...prev, spells: newSpells };
    });
  };

  const updateSpellSlot = (levelIndex: number, max: number) => {
      setCharacter(prev => {
          const newSlots = [...prev.spellSlots];
          newSlots[levelIndex] = max;
          return { ...prev, spellSlots: newSlots };
      });
  };

  return {
    character,
    setCharacter,
    updateStat,
    updateField,
    setSkillLevel,
    addFeat,
    removeFeat,
    toggleFeatureActive,
    addEquipment,
    removeEquipment,
    autoCalculateVitals,
    addSpell,
    removeSpell,
    toggleSpellPrepared,
    updateSpellSlot
  };
};
