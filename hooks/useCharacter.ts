



import { useState } from 'react';
import { Character, INITIAL_CHARACTER, Ability, ProficiencyLevel, Feat, Spell, EquipmentItem } from '../types';
import { calculateMaxHP, calculateAC, formatClassString } from '../utils/characterUtils';
import { CLASS_HIT_DICE } from '../constants';

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

  const addClassLevel = (className: string) => {
    const hitDie = CLASS_HIT_DICE[className] || 8;
    const newEntry = {
      id: crypto.randomUUID(),
      className,
      hitDie
    };

    setCharacter(prev => {
      const newHistory = [...prev.classHistory, newEntry];
      const newClassStr = formatClassString(newHistory);
      return {
        ...prev,
        classHistory: newHistory,
        level: newHistory.length,
        class: newClassStr
      };
    });
  };

  const removeClassLevel = (index: number) => {
    setCharacter(prev => {
      const newHistory = prev.classHistory.filter((_, i) => i !== index);
      const newClassStr = formatClassString(newHistory);
      return {
        ...prev,
        classHistory: newHistory,
        level: newHistory.length,
        class: newClassStr
      };
    });
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

  const addEquipment = (item: EquipmentItem) => {
    setCharacter(prev => ({
      ...prev,
      equipment: [...prev.equipment, item]
    }));
  };

  const removeEquipment = (index: number) => {
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const updateEquipmentQuantity = (index: number, quantity: number) => {
     setCharacter(prev => {
       const newEquipment = [...prev.equipment];
       if(newEquipment[index]) {
         newEquipment[index] = { ...newEquipment[index], quantity: Math.max(1, quantity) };
       }
       return { ...prev, equipment: newEquipment };
     });
  };

  const autoCalculateVitals = () => {
    const newHP = calculateMaxHP(character.classHistory, character.stats.Constitution, character.feats);
    // Use first class in history as primary for AC calculation (e.g. Barbarian Unarmored Defense)
    const primaryClass = character.classHistory.length > 0 ? character.classHistory[0].className : 'Commoner';
    const newAC = calculateAC(primaryClass, character.stats.Dexterity, character.stats.Constitution, character.stats.Wisdom);
    
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
    addClassLevel,
    removeClassLevel,
    setSkillLevel,
    addFeat,
    removeFeat,
    toggleFeatureActive,
    addEquipment,
    removeEquipment,
    updateEquipmentQuantity,
    autoCalculateVitals,
    addSpell,
    removeSpell,
    toggleSpellPrepared,
    updateSpellSlot
  };
};