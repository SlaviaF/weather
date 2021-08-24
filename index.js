const inputCity = document.getElementById("inputCity");
const weatherBtn = document.getElementById("weatherBtn");
const temp = document.getElementById("temp");
const icon = document.getElementById("icon");
const clouds = document.getElementById("clouds");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const map = document.getElementById("map");
const currentLctBtn = document.getElementById("currentLctBtn");
const loading = document.getElementById("loading");
const container = document.getElementById("container");
const infoBox = document.getElementById("infoBox");
const message = document.getElementById("message");
const contentContainer = document.getElementById("content-container");

weatherBtn.addEventListener("click", getCityWeather);
function getCityWeather() {
  let cityName = inputCity.value;
  if (!cityName) {
    alert(`Enter a city name`);
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=ae80d9c115b082960ef280331a3b25f9`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Enter valid City Name");
      }
    })
    .then((weatherData) => {
      renderWeatherStatus(weatherData);
      inputCity.value = "";
      infoBox.style.visibility = "visible";
      localStorage.setItem("userLocation", renderWeatherStatus(weatherData));
    })
    .catch((error) => {
      infoBox.style.visibility = "hidden";
      alert(error);
    });
}
//Get weather from  user location
currentLctBtn.addEventListener("click", getUserLocation);
function getUserLocation() {
  infoBox.style.visibility = "visible";
  function onSuccess(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    displayMap(lat, lng);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=ae80d9c115b082960ef280331a3b25f9`
    )
      .then((response) => response.json())
      .then((userWeatherData) => {
        renderWeatherStatus(userWeatherData);
      });
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }
}
function displayMap(lat, lng) {
  let map;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 8,
  });
}

function renderWeatherStatus(weatherData) {
  let temperature = weatherData.main;
  temperature = Math.round(temperature.temp);
  temp.innerText = ` ${temperature}°`;

  if (temperature < 10) {
    message.innerText = `Its so cold. Dont Forget your mittens`;
    contentContainer.style.backgroundImage =
      "linear-gradient(rgb(156, 156, 235), rgb(109, 109, 212))";
  }
  if (temperature >= 10 && temperature < 20) {
    message.innerText = `Just a sweater would do`;
    contentContainer.style.backgroundImage =
      "linear-gradient(lrgb(243, 224, 188),rgb(187, 151, 83))";
  }
  if (temperature >= 20) {
    message.innerText = `It's a nice warm day. Enjoy the weather`;
    contentContainer.style.backgroundImage =
      "linear-gradient(rgb(187, 245, 226), rgb(89, 163, 138))";
  }
  let iconCode = weatherData.weather[0].icon;
  let iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  icon.src = iconurl;

  let cloudiness = weatherData.clouds.all;
  let cloudsDescription = weatherData.weather[0].description;
  clouds.innerText = `${cloudiness} % cloudiness with ${cloudsDescription}`;

  let sunriseTime = weatherData.sys.sunrise;
  let utcMilliSecSunrise = sunriseTime * 1000;
  let actualSunriseTime = new Date(utcMilliSecSunrise);
  actualSunriseTime = actualSunriseTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  sunrise.innerText = actualSunriseTime;

  let sunsetTime = weatherData.sys.sunset;
  let utcMilliSecSunset = sunsetTime * 1000;
  let actualSunsetTime = new Date(utcMilliSecSunset);
  actualSunsetTime = actualSunsetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  sunset.innerText = actualSunsetTime;

  let lat = weatherData.coord.lat;
  let lng = weatherData.coord.lon;
  displayMap(lat, lng);
}


