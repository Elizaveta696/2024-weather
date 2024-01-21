const API_KEY = 'ca38f957a5427f0828193ee5476b546f';
const API_KEY2 = "15dcfc1b907c4285bad6d83075c9fcbd";
const LAT = "60.1695";
const LONG = "24.9354";


const displayFutureWeather = ((data) => {
    document.getElementById("time-1").innerText = data.list[0].dt_txt.substring(11, 16);
    document.getElementById("image-1").src = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
    document.getElementById("temp-1").innerText = Math.round(data.list[0].main.temp)  + " ℃";

    document.getElementById("time-2").innerText = data.list[1].dt_txt.substring(11, 16);
    document.getElementById("image-2").src = "https://openweathermap.org/img/wn/" + data.list[1].weather[0].icon + "@2x.png";
    document.getElementById("temp-2").innerText = Math.round(data.list[1].main.temp) + " ℃";

    document.getElementById("time-3").innerText = data.list[2].dt_txt.substring(11, 16);
    document.getElementById("image-3").src = "https://openweathermap.org/img/wn/" + data.list[2].weather[0].icon + "@2x.png";
    document.getElementById("temp-3").innerText = Math.round(data.list[2].main.temp) + " ℃";
})

const fetchFutureWeather = async() => {
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LONG}&appid=${API_KEY}&units=metric`);
        if(!response.ok){
            throw new Error(response.status);
        }
        const data = await response.json();
        console.log(data);

        displayFutureWeather(data);

    } catch (error) {
        console.log(error);
    }
}


const createInfo = (temp, tempFeels, descript, weatherId, icon, humidity, wind) => {
    console.log(temp + " " + tempFeels + " " + descript + " " + weatherId);
    let initialBox = document.getElementById("initial-box")
    let infoContainer = document.getElementById("info-container");
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'info-container';
        initialBox.appendChild(infoContainer);
    }
    document.getElementById('main-heading').innerText = 'Helsinki';
    const tempValueBox = document.createElement('div');
    tempValueBox.className = 'temp-value-box';
    let tempValue = document.createElement('p');
    tempValue.innerText = Math.round(temp) + " ℃";

    const currentTempIconBox = document.createElement('div');
    currentTempIconBox.className = 'current-temp-icon-box';
    const currentTempIcon = document.createElement('img');
    currentTempIcon.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    currentTempIconBox.append(currentTempIcon);
    
    tempValueBox.append(tempValue);
    tempValueBox.append(currentTempIconBox);

    const additionalInfoBox = document.createElement('div');
    additionalInfoBox.className = 'additional-box'
    const tempFeelsValue = document.createElement('p');
    tempFeelsValue.innerText = "Feels like: " + Math.round(tempFeels) + " ℃";
    additionalInfoBox.append(tempFeelsValue);
    tempFeelsValue.className = 'temp-feels-value'

    const humidityValue = document.createElement('p');
    humidityValue.innerText = "Humidity: " + humidity + " %";
    additionalInfoBox.append(humidityValue);
    humidityValue.className = 'humidity-value;'

    const windValue = document.createElement('p');
    windValue.innerText = "Wind: " + Math.round(wind) + " km/h" 
    additionalInfoBox.append(windValue);
    windValue.className = 'wind-value'




    infoContainer.append(tempValueBox);
    infoContainer.append(additionalInfoBox);
    
    if (weatherId < 300) {
        initialBox.style.backgroundImage = 'url("./images/thunderstorm.webp")';
        initialBox.style.color = 'white';
    } else if (300 <= weatherId && weatherId < 500) {
        initialBox.style.backgroundImage = 'url("./images/drizzle.jpg")';
    } else if (500 <= weatherId && weatherId < 600) {
        initialBox.style.backgroundImage = 'url("./images/rain.webp")';
    } else if (600 <= weatherId && weatherId < 700) {
        initialBox.style.backgroundImage = 'url("./images/snow.jpg")';
    } else if (700 <= weatherId && weatherId < 800) {
        initialBox.style.backgroundImage = 'url("./images/mist.jpg")';
        document.getElementById("main-heading").style.color = 'white';
    } else if (weatherId === 800) {
        initialBox.style.backgroundImage = 'url("./images/sunny.jpg")';

    } else {
        initialBox.style.backgroundImage = 'url("./images/cloudy.webp")';

    }
    

    return infoContainer;
}


const fetchWeatherData = async() => {
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LONG}&appid=${API_KEY}&units=metric`);
        if(!response.ok){
            throw new Error(response.status)
        }
        const data = await response.json();
        const infoContainer = document.getElementById("info-container");
        infoContainer.innerHTML = ''; // Clear existing content inside info-container
        createInfo(data.main.temp, data.main.feels_like, data.weather[0].description, data.weather[0].id, data.weather[0].icon, data.main.humidity, data.wind.speed);
        fetchFutureWeather();
        console.log(data);
        


    } catch (error) {
        console.log(error);
    }
}
fetchWeatherData();
setInterval(fetchWeatherData, 20 * 60 * 1000); // reset every 20 min


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showTemperatureByPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function showTemperatureByPosition(position) {
    try{
        console.log('Geolocation successful:', position);
        alert(position.coords.latitude + " " + position.coords.longitude);
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const response1 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        
        if(!response1.ok || !response2.ok){
            throw new Error(response2.status + " " + response2.status);
        }
        const data1 = await response1.json();
        const data2 = await response2.json();
        const infoContainer = document.getElementById("info-container");


        infoContainer.innerHTML = ''; // Clear existing content inside info-container
        createInfo(data2.main.temp, data2.main.feels_like, data2.weather[0].description, data2.weather[0].id, data2.weather[0].icon, data2.main.humidity, data2.wind.speed);
        displayFutureWeather(data1);
        fetchCityLocation(lat, long);

    
    } catch (error){
        console.log(error);
    }
    
    
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

const fetchCityLocation = async(latitude, longitude) => {

    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY2}&language=en`);
    if(!response.ok){
        throw new Error(response.status);
    }
    const data = await response.json();
    console.log(data.results[0].components.city);
    changeCityName(data.results[0].components.city);
}
const changeCityName = (city) => {
    document.getElementById('main-heading').innerText = city;
}
