import React, { useState } from 'react';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { ThemeProvider } from './context/ThemeContext';
import { OrbProvider } from './context/OrbContext';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { StarfieldBackground } from './components/StarfieldBackground';
import { Questionnaire } from './pages/Questionnaire';

function App() {
  const [screen, setScreen] = useState('questionnaire');
  const [startAtStep, setStartAtStep] = useState(0);

  return (
    <ThemeProvider>
      <OrbProvider>
        <QuestionnaireProvider>
        <div className="app-shell">
          <StarfieldBackground />
          <SiteHeader onGoHome={() => { setStartAtStep(0); setScreen('questionnaire'); }} />
          <main className="app-center">
            <div className="app-center__content">
              {screen === 'questionnaire' && (
                <Questionnaire
                  initialStepIndex={startAtStep}
                  onBackToStart={() => {
                    setStartAtStep(0);
                    setScreen('questionnaire');
                  }}
                />
              )}
            </div>
          </main>
          <SiteFooter />
        </div>
        </QuestionnaireProvider>
      </OrbProvider>
    </ThemeProvider>
  );
}

export default App;
