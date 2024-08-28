const apiKey = 'd385401ae3b054ce59a8b6dc43483a57'; 

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        });
}

function getWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            alert('Unable to retrieve weather data.');
            console.error('Error:', error);
        });
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherData(lat, lon);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherContainer');
    const currentWeather = data.current;
    
    const weatherIconUrl = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;

    weatherContainer.innerHTML = `
        <h2>${data.timezone}</h2>
        <img src="${weatherIconUrl}" alt="${currentWeather.weather[0].description}" class="weather-icon">
        <p><strong>Temperature:</strong> ${currentWeather.temp} °C</p>
        <p><strong>Weather:</strong> ${currentWeather.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${currentWeather.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${currentWeather.wind_speed} m/s</p>
        
    `;
    
    displayForecast(data.daily);
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '<h3>5-Day Forecast:</h3>';
    
    forecast.slice(1, 6).forEach(day => {
        const weatherIconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        forecastContainer.innerHTML += `
            <p>
                <strong>${new Date(day.dt * 1000).toLocaleDateString()}</strong><br>
                <img src="${weatherIconUrl}" alt="${day.weather[0].description}" class="weather-icon">
                Temp: ${day.temp.day} °C<br>
                Weather: ${day.weather[0].description}
            </p>
        `;
    });
}

function resetApp() {
    document.getElementById('weatherContainer').innerHTML = '';
    document.getElementById('forecastContainer').innerHTML = '';
    document.getElementById('cityInput').value = '';
}