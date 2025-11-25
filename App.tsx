
import React, { useState } from 'react';
import { AICharacterSuggestion, ProficiencyLevel } from './types';
import { SKILL_DATA } from './constants';
import { generateCharacterFromPrompt, generateBackstory, suggestName } from './services/geminiService';
import { calculateMaxHP, calculateAC } from './utils/characterUtils';
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

      // Calculate derived stats
      const hp = calculateMaxHP(suggestion.class, 1, suggestion.stats.Constitution, suggestion.feats || []);
      const ac = calculateAC(suggestion.class, suggestion.stats.Dexterity, suggestion.stats.Constitution, suggestion.stats.Wisdom);

      setCharacter(prev => ({
        ...prev,
        name: suggestion.name,
        species: suggestion.species,
        class: suggestion.class,
        background: suggestion.background,
        stats: suggestion.stats,
        skills: skillsMap,
        feats: suggestion.feats || [],
        hitPoints: hp,
        currentHitPoints: hp,
        armorClass: ac,
        currentHitDice: 1, // Default to level 1
        backstory: suggestion.shortBackstory,
        // Reset spells/slots on quick build for now or we could try to generate them
        spellcastingAbility: 'None',
        spellSlots: [0,0,0,0,0,0,0,0,0],
        spells: []
      }));
    } catch (e) {
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
            setSkillLevel={setSkillLevel}
            removeFeat={removeFeat}
            toggleFeatureActive={toggleFeatureActive}
            addEquipment={addEquipment}
            removeEquipment={removeEquipment}
            autoCalculateVitals={autoCalculateVitals}
            addSpell={addSpell}
            removeSpell={removeSpell}
            toggleSpellPrepared={toggleSpellPrepared}
            updateSpellSlot={updateSpellSlot}
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
