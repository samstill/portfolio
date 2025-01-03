import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import MeshGradientBackground from './presentation/components/MeshGradientBackground';
import HomeScreen from './presentation/screens/HomeScreen';
import NotFoundScreen from './presentation/screens/NotFoundScreen';
import './shared/styles/typography.css';
import { ThemeProvider } from './shared/context/ThemeContext';

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContainer>
          <MeshGradientBackground />
          <ContentContainer>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </ContentContainer>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
