import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonProvider } from './contexts/PokemonProvider';
import { PlayerProvider } from './contexts/PlayerProvider';
import { ServicesProvider, createDefaultServices } from './modules/services';
import App from './App.jsx';
import './index.css';
import './styles/game-ui.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const services = createDefaultServices();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServicesProvider services={services}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <PlayerProvider>
            <PokemonProvider>
              <App />
            </PokemonProvider>
          </PlayerProvider>
        </HashRouter>
      </QueryClientProvider>
    </ServicesProvider>
  </React.StrictMode>
);
