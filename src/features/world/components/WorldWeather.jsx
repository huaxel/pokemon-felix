import React from 'react';

export function WorldWeather({ weather, isNight }) {
    return (
        <>
            {/* Weather Effects */}
            {weather === 'rainy' && <div className="rain-overlay"></div>}
            {weather === 'snowy' && <div className="snow-overlay"></div>}

            {/* Night Sky Effects */}
            {isNight && (
                <div className="night-sky">
                    <div className="moon"></div>
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 60}%`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
