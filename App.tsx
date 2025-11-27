

import React, { useState } from 'react';
import { AICharacterSuggestion, ProficiencyLevel } from './types';
import { SKILL_DATA, CLASS_HIT_DICE, SUBCLASS_DATA } from './constants';
import { generateCharacterFromPrompt, generateBackstory, suggestName } from './services/geminiService';
import { calculateMaxHP, calculateAC, formatClassString } from './utils/characterUtils';
import { useCharacter } from './hooks/useCharacter';
import { Header } from './components/Header';
import { FeatModal } from './components/FeatModal';
import { CharacterEditor } from './components/CharacterEditor';
import { CharacterSheet } from './components/CharacterSheet';

const App: React.FC = () => {
  const { 
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
    updateSpellSlot,
    addToolProficiency,
    removeToolProficiency,
    addLanguage,
    removeLanguage
  } = useCharacter();

  const [view, setView] = useState<'edit' | 'sheet'>('edit');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [isFeatModalOpen, setIsFeatModalOpen] = useState(false);

  // --------------------------------------------------------------------------
  // AI Handlers
  // --------------------------------------------------------------------------

  const handleQuickBuild = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const suggestion: AICharacterSuggestion = await generateCharacterFromPrompt(aiPrompt);
      
      // Convert generated string array to skills map
      const skillsMap: Record<string, ProficiencyLevel> = {};
      if (suggestion.skills) {
        suggestion.skills.forEach(s => {
          const match = SKILL_DATA.find(sd => sd.name.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(sd.name.toLowerCase()));
          if (match) {
            skillsMap[match.name] = 'proficient';
          }
        });
      }

      // Generate Class History based on suggested level
      // Attempt to map AI class name to a subclass or fallback
      let subclassName = suggestion.class;
      let className = suggestion.class;
      
      // Try to find a subclass match first
      const subMatch = SUBCLASS_DATA.find(s => s.name.toLowerCase() === suggestion.class.toLowerCase());
      if (subMatch) {
          subclassName = subMatch.name;
          className = subMatch.className;
      } else {
          // If not a subclass name, try to find it as a Class Name and pick the first subclass
          const classMatch = SUBCLASS_DATA.find(s => s.className.toLowerCase() === suggestion.class.toLowerCase());
          if (classMatch) {
              subclassName = classMatch.name;
              className = classMatch.className;
          }
      }

      const generatedHistory = Array.from({ length: suggestion.level || 1 }).map(() => ({
        id: crypto.randomUUID(),
        className: className,
        subclassName: subclassName,
        hitDie: CLASS_HIT_DICE[className] || 8
      }));
      
      const classStr = formatClassString(generatedHistory);

      // Calculate derived stats
      const hp = calculateMaxHP(generatedHistory, suggestion.stats.Constitution, suggestion.feats || []);
      const ac = calculateAC(className, suggestion.stats.Dexterity, suggestion.stats.Constitution, suggestion.stats.Wisdom);

      setCharacter(prev => ({
        ...prev,
        name: suggestion.name,
        species: suggestion.species,
        class: classStr,
        classHistory: generatedHistory,
        background: suggestion.background,
        stats: suggestion.stats,
        skills: skillsMap,
        feats: suggestion.feats || [],
        toolProficiencies: suggestion.toolProficiencies || [],
        languages: suggestion.languages || ['Common'],
        hitPoints: hp,
        currentHitPoints: hp,
        armorClass: ac,
        level: suggestion.level || 1,
        currentHitDice: suggestion.level || 1,
        backstory: suggestion.shortBackstory,
        // Reset spells/slots on quick build for now or we could try to generate them
        spellcastingAbility: 'None',
        spellSlots: [0,0,0,0,0,0,0,0,0],
        spells: [],
        equipment: []
      }));
    } catch (e) {
      console.error(e);
      alert("Failed to generate character. Please check API configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBackstory = async () => {
    setIsGeneratingBackstory(true);
    try {
      const story = await generateBackstory(character);
      updateField('backstory', story);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  const handleSuggestName = async () => {
     const name = await suggestName(character.species, character.class);
     updateField('name', name);
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-gray-200 pb-12">
      <Header view={view} setView={setView} />
      
      <main className="pt-6">
        {view === 'edit' ? (
          <CharacterEditor 
            character={character}
            updateField={updateField}
            updateStat={updateStat}
            addClassLevel={addClassLevel}
            removeClassLevel={removeClassLevel}
            setSkillLevel={setSkillLevel}
            removeFeat={removeFeat}
            toggleFeatureActive={toggleFeatureActive}
            addEquipment={addEquipment}
            removeEquipment={removeEquipment}
            updateEquipmentQuantity={updateEquipmentQuantity}
            autoCalculateVitals={autoCalculateVitals}
            addSpell={addSpell}
            removeSpell={removeSpell}
            toggleSpellPrepared={toggleSpellPrepared}
            updateSpellSlot={updateSpellSlot}
            addToolProficiency={addToolProficiency}
            removeToolProficiency={removeToolProficiency}
            addLanguage={addLanguage}
            removeLanguage={removeLanguage}
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            isGenerating={isGenerating}
            onQuickBuild={handleQuickBuild}
            isGeneratingBackstory={isGeneratingBackstory}
            onGenerateBackstory={handleGenerateBackstory}
            onSuggestName={handleSuggestName}
            onOpenFeatModal={() => setIsFeatModalOpen(true)}
          />
        ) : (
          <CharacterSheet character={character} />
        )}
      </main>

      {isFeatModalOpen && (
        <FeatModal 
          character={character}
          onClose={() => setIsFeatModalOpen(false)}
          onAddFeat={addFeat}
        />
      )}
    </div>
  );
};

export default App;