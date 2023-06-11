import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import lottieJson from './loading.json'; 
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get('https://swapi.dev/api/planets/')
      .then(response => {
        const sortedPlanets = response.data.results.sort((a, b) => a.name.localeCompare(b.name));
        setPlanets(sortedPlanets);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const formatNumber = (num) => {
    if (num === 'unknown') return '?';
    return parseInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  const calcSurfaceWaterArea = (diameter, surfaceWater) => {
    if (diameter === 'unknown' || surfaceWater === 'unknown') return '?';
    const radius = parseInt(diameter) / 2;
    const totalSurfaceArea = 4 * Math.PI * Math.pow(radius, 2);
    const waterArea = totalSurfaceArea * (parseInt(surfaceWater) / 100);
    return formatNumber(Math.round(waterArea));
  }
  
  const LoadingAnimationWithText = () => (
    <div className="loading-container">
      <Lottie
        animationData={lottieJson}
        play
        className="loading-animation"
      />
      <p className="loading-text">
        Loading...
      </p>
    </div>
  );

  return (
    <div className="App">
      <h1>Star Wars Planets</h1>
      {loading && <LoadingAnimationWithText />}
      {error && <p>An error occurred. Please try again later.</p>}
      {!loading && !error &&
        <table className="planets-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Climate</th>
              <th># Residents</th>
              <th>Terrain</th>
              <th>Population</th>
              <th>Surface Area (km²)</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((planet, index) => (
              <tr key={index}>
                <td><a href={planet.url} target="_blank" rel="noreferrer">{planet.name}</a></td>
                <td>{planet.climate}</td>
                <td>{planet.residents.length}</td>
                <td>{planet.terrain}</td>
                <td>{formatNumber(planet.population)}</td>
                <td>{calcSurfaceWaterArea(planet.diameter, planet.surface_water)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default App;
