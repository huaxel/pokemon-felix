import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { PokemonProvider } from './contexts/PokemonProvider'
import { PlayerProvider } from './contexts/PlayerProvider'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <PlayerProvider>
                <PokemonProvider>
                    <App />
                </PokemonProvider>
            </PlayerProvider>
        </HashRouter>
    </React.StrictMode>,
)
