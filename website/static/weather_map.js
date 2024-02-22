// Module to handle getting user's location in order to display local weather
// Such information can be used to create appropraite irrigation plans

const apiKey = "ebd9b01abad771817936adcd84e62b84";
let currentW = {};
let forecast = [];
const notificationElement = document.getElementById("notification");

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPos, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support your geolocation...</p>";
}

function setPos(pos) {
    let lat = pos.coords.latitude;
    let long = pos.coords.longitude;
    getWeather(lat, long);
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
    let getWeatherLink = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    fetch(getWeatherLink) 
        .then(function(response) {
            let data = response.json();
            return data;
        }) 

        .then(function (data) {
            currentW.location = data.name;
            currentW.temperature = data.main.temp;
            currentW.lowTemp = data.main.temp_min;
            currentW.highTemp = data.main.temp_max;
            
            currentW.description = data.weather[0].description;
            currentW.img = data.weather[0].icon;
            console.log(currentW);
        })

        .then(function() {
            displayCurrentWeather();
            getForecast(latitude, longitude);
        })
}

function getForecast(latitude, longitude) {
    let getForecastLink = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5`
    fetch(getForecastLink) 
        .then(function(response) {
            let data = response.json();
            return data;
        }) 
 
        .then(function (data) {
            for (let hour = 0; hour <= 4; hour++) {
                const fore = {
                    "temperature": data.list[hour].main.temp,
                    "icon": data.list[hour].weather[0].icon
                };
                forecast.push(fore);                
            }
            console.log(forecast);
        })

        .then(function() {
            displayForecast();
        })
}

function displayCurrentWeather() {
    document.querySelector(".current-location").innerHTML = `${currentW.location}`;
    document.querySelector(".current-weather-degree").innerHTML = `Current Temperature: ${currentW.temperature}°`;
    document.querySelector(".current-weather-desc").innerHTML = `Current Weather Conditions: ${currentW.description.charAt(0).toUpperCase() + currentW.description.substr(1).toLowerCase()}`;
    document.querySelector(".low-temp").innerHTML = `Low of: ${currentW.lowTemp}°`;
    document.querySelector(".high-temp").innerHTML = `High of: ${currentW.highTemp}°`;
}

function displayForecast() {
    for (let hr = 0; hr <= 4; hr++) {
        let string = "hour" + hr;
        let div = document.getElementById(string).childNodes; //[<p>, <img>, <p>]

        div[1].src = `icons/icons/${forecast[hr].icon}`;
        div[2].innerHTML = forecast[hr].temperature;       
    }  
}