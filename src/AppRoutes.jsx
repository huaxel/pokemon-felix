import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const PokemonModal = lazy(() => import('./components/PokemonModal').then(mod => ({ default: mod.PokemonModal })));

// Feature Pages
import { CollectionPage } from './features/pokedex/CollectionPage';
import { BattlePage } from './features/battle/BattlePage';
import { TournamentLayout } from './features/tournament/TournamentLayout';
import { GachaPage } from './features/gacha/GachaPage';
import { StarterPage } from './features/onboarding/StarterPage';
import { CharacterCreationPage } from './features/onboarding/CharacterCreationPage';
import { CityHallPage } from './features/world/pages/CityHallPage';
import { SquadPage } from './features/squad/SquadPage';
import { PokedexPage } from './features/pokedex/PokedexPage';
import { WorldPage } from './features/world/WorldPage';
import { MarketPage } from './features/world/pages/MarketPage';
import { EvolutionPage } from './features/world/pages/EvolutionPage';
import { GymPage } from './features/world/pages/GymPage';
import { BagPage } from './features/world/pages/BagPage';
import { CarePage } from './features/care/CarePage';
import { SchoolPage } from './features/world/pages/SchoolPage';
import { WardrobePage } from './features/world/pages/WardrobePage';
import { BankPage } from './features/world/pages/BankPage';
import { PotionLabPage } from './features/world/pages/PotionLabPage';
import { FountainPage } from './features/world/pages/FountainPage';
import { PalacePage } from './features/world/pages/PalacePage';
import { EvolutionHallPage } from './features/world/pages/EvolutionHallPage';
import { MountainPage } from './features/world/pages/MountainPage';
import { SecretCavePage } from './features/world/pages/SecretCavePage';
import { WaterRoutePage } from './features/world/pages/WaterRoutePage';
import { PorygonLabPage } from './features/porygon/PorygonLabPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { BattleSelectionPage } from './features/battle/BattleSelectionPage';
import { SingleBattlePage } from './features/battle/SingleBattlePage';
import { DesertPage } from './features/world/pages/DesertPage';
import { CaveDungeonPage } from './features/world/pages/CaveDungeonPage';
import { ArtStudioPage } from './features/world/pages/ArtStudioPage';
import { DecorShopPage } from './features/world/pages/DecorShopPage';
import { PokemonCenterPage } from './features/world/pages/PokemonCenterPage';
import { WorldSelectionPage } from './features/world/pages/WorldSelectionPage';

export function AppRoutes({
    ownedIds,
    toggleOwned,
    pokemonList,
    loadPokemon,
    selectedPokemon,
    setSelectedPokemon
}) {
    return (
        <>
            <Routes>
                <Route path="/character-creation" element={<CharacterCreationPage />} />
                <Route path="/" element={<StarterPage />} />
                <Route path="/pokedex" element={<PokedexPage />} />
                <Route path="/collection" element={
                    <CollectionPage
                        ownedIds={ownedIds}
                        onToggleOwned={toggleOwned}
                    />
                } />
                <Route path="/battle" element={
                    <BattlePage allPokemon={pokemonList} onLoadMore={loadPokemon} />
                } />
                <Route path="/battle-modes" element={<BattleSelectionPage />} />
                <Route path="/single-battle" element={<SingleBattlePage allPokemon={pokemonList} />} />
                <Route path="/tournament" element={<TournamentLayout allPokemon={pokemonList} />} />
                <Route path="/gacha" element={<GachaPage />} />
                <Route path="/squad" element={<SquadPage />} />
                <Route path="/adventure" element={<WorldPage />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/evolution" element={<EvolutionPage />} />
                <Route path="/gym" element={<GymPage />} />
                <Route path="/bag" element={<BagPage />} />
                <Route path="/care" element={<CarePage />} />
                <Route path="/school" element={<SchoolPage />} />
                <Route path="/wardrobe" element={<WardrobePage />} />
                <Route path="/bank" element={<BankPage />} />
                <Route path="/potion-lab" element={<PotionLabPage />} />
                <Route path="/fountain" element={<FountainPage />} />
                <Route path="/palace" element={<PalacePage />} />
                <Route path="/evolution-hall" element={<EvolutionHallPage />} />
                <Route path="/mountain" element={<MountainPage />} />
                <Route path="/secret-cave" element={<SecretCavePage />} />
                <Route path="/water-route" element={<WaterRoutePage />} />
                <Route path="/porygon-lab" element={<PorygonLabPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/desert" element={<DesertPage />} />
                <Route path="/cave-dungeon" element={<CaveDungeonPage />} />
                <Route path="/city-hall" element={<CityHallPage />} />
                <Route path="/art-studio" element={<ArtStudioPage />} />
                <Route path="/decor-shop" element={<DecorShopPage />} />
                <Route path="/center" element={<PokemonCenterPage />} />
                <Route path="/world-select" element={<WorldSelectionPage />} />
            </Routes>

            {selectedPokemon && (
                <Suspense fallback={null}>
                    <PokemonModal
                        pokemon={selectedPokemon}
                        onClose={() => setSelectedPokemon(null)}
                        isOwned={ownedIds.includes(selectedPokemon.id)}
                        onToggleOwned={toggleOwned}
                    />
                </Suspense>
            )}
        </>
    );
}
