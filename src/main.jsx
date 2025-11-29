import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { PokemonProvider } from './contexts/PokemonContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <PokemonProvider>
                <App />
            </PokemonProvider>
        </HashRouter>
    </React.StrictMode>,
)
