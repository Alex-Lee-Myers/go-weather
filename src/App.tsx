import React from 'react';
import GeoWeather from './components/GeoWeather';


const App: React.FunctionComponent = () => {


//! Fetch the coordinates of the user from the Geolocation API.




  return (
    <div className="App">
      <GeoWeather />
    </div>
  );
}

export default App;
