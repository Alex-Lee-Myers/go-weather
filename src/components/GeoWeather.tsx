//! 1) Using typescript, create a class component.
//! 2) The class component should reach out to the Geolocation API to grab your coordinates.
//! 3) Then using those coordinates, reach out to the Open Weather API and retrieve the weather information for your area.
//! 4) Once you have the weather, it should be sent to the functional component of App.tsx to be displayed.
import React from 'react';
import styled from "styled-components";

interface Location {
    latitude: number | null;
    longitude: number | null;
}

interface Weather {
    temp: number | null;
    description: string;
    icon: string;
}

export class GeoWeather extends React.Component<{}, { location: Location, weather: Weather }> {
    // when the user hits a button, the getLocation() function and the getWeather() function should be called and the state should be updated.
    // The weather should be displayed in the DOM.
    
    constructor(props: {}) {
        super(props);
        this.state = {
            location: {
                latitude: null,
                longitude: null
            },
            weather: {
                temp: null,
                description: '',
                icon: ''
            }
        }
    }

    shouldComponentUpdate(nextProps: {}, nextState: {}) {
        return this.state !== nextState;
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        });
    }
    //TODO - change the API key back to mine after the infinite loop / too many requests error is resolved...whoops...darn you ComponentDidMount and my former lack of undertanding of the lifecycle method.😂
    getWeather() {
        if (this.state.location.latitude && this.state.location.longitude) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&appid=4a9339867b7a0458ce8675757cd8ba3e`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.setState({
                        weather: {
                            temp: +((data.main.temp - 273.15) * (9/5) + 32).toFixed(0), //! s/o to Amit for the "+" sign tip to convert to number.
                            description: data.weather[0].description,
                            icon: data.weather[0].icon
                        }
                        
                    });
                } 
                );
        } else {
            return 'No location found. Please grab your location before trying to get the weather.';
    }
    }


    render() {
        return (
            <StyledGeoWeather >
                
                <StyledH2 >
                    <span >Ready to get the weather?</span>
                    <span >Get your location first!</span>
                </StyledH2>
                <StyledButton onClick={() => this.getLocation()}>Get Location</StyledButton>
                {/* disable the GetWeather() button until getLocation is grabbed */}
                <>{this.state.location.latitude && this.state.location.longitude ? <StyledButton onClick={() => this.getWeather()}>Get Weather</StyledButton> : null}</>
                <StyledParagraph>Latitude: {this.state.location.latitude}</StyledParagraph>
                <StyledParagraph>Longitude: {this.state.location.longitude}</StyledParagraph>
                <StyledParagraph>Weather: {this.state.weather.temp}</StyledParagraph>
                <StyledParagraph>Description: {this.state.weather.description} </StyledParagraph>
                <img src={`http://openweathermap.org/img/wn/${this.state.weather.icon}.png`} alt={this.state.weather.description} />
                
            </StyledGeoWeather>
        );
    }
}

//! Styled Components:
const StyledGeoWeather = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #638d8d;
    width: 100%;
    height: 100vh;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    text-align: center;
    padding: 1rem;
    margin: 0;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.5);
`;

const StyledButton = styled.button`
    background-color: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #638d8d;
    cursor: pointer;
    &:hover {
        background-color: #638d8d;
        color: #f5f5f5;
    }
`;

const StyledDisabledButton = styled.button`
    background-color: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #638d8d;
    cursor: not-allowed;
`;

const StyledParagraph = styled.p`
        color: #fff;
        font-size: 1rem;
        margin: 0.5rem;
`;

const StyledH2 = styled.h2`
        color: #fff;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 2rem;
`;

export default GeoWeather;