import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { Welcome } from './pages/Welcome';
import { Questionnaire } from './pages/Questionnaire';
import { Results } from './pages/Results';

function App() {
  return (
    <QuestionnaireProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </QuestionnaireProvider>
  );
}

export default App;
