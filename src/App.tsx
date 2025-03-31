import React from 'react';
import styled, { StyleSheetManager, createGlobalStyle } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import MeshGradientBackground from './presentation/components/MeshGradientBackground';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AuthProvider } from './shared/context/AuthContext';
import { ProfileProvider } from './shared/context/ProfileContext';
import { AIProvider } from './shared/contexts/AIContext';
import './shared/styles/typography.css';
import Router from './Router';

// Add Global Styles to reset margins and paddings
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }
  
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
`;

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
    <StyleSheetManager shouldForwardProp={(prop) => !['margin'].includes(prop)}>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <AIProvider>
                <GlobalStyle />
                <AppContainer>
                  <MeshGradientBackground />
                  <ContentContainer>
                    <Router />
                  </ContentContainer>
                </AppContainer>
              </AIProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </StyleSheetManager>
  );
};

export default App;
