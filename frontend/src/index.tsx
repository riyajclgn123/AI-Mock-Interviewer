import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { MantineEmotionProvider } from '@mantine/emotion';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
       <MantineEmotionProvider>
          <Router>
        <App />
      </Router>
      </MantineEmotionProvider>
    </MantineProvider>
  </React.StrictMode>
);