import React, { useState } from 'react';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Welcome } from './pages/Welcome';
import { Questionnaire } from './pages/Questionnaire';
import { Results } from './pages/Results';

function App() {
  const [screen, setScreen] = useState('welcome');

  return (
    <ThemeProvider>
      <QuestionnaireProvider>
        <div className="app">
          <header className="app-header">
            <ThemeToggle />
          </header>
          <main className="app-main">
            {screen === 'welcome' && (
              <Welcome onStartQuestionnaire={() => setScreen('questionnaire')} />
            )}
            {screen === 'questionnaire' && (
              <Questionnaire
                onBackToStart={() => setScreen('welcome')}
                onShowResults={() => setScreen('results')}
              />
            )}
            {screen === 'results' && (
              <Results onBackToQuestionnaire={() => setScreen('questionnaire')} />
            )}
          </main>
        </div>
      </QuestionnaireProvider>
    </ThemeProvider>
  );
}

export default App;
