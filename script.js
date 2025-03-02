async function fetchWeather() {
  const apiKey = "cdd59c550b509d992977f2a60ed271ff"; // Ganti dengan API key dari OpenWeather
  const city = document.getElementById("city").value || "Jakarta"; // Default ke Jakarta jika kosong
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== "200") throw new Error(data.message);

    document.getElementById("temperature").innerText = `${Math.round(
      data.list[0].main.temp
    )}°C`;
    document.getElementById("description").innerText =
      data.list[0].weather[0].description;
    document.getElementById("feels-like").innerText = `${Math.round(
      data.list[0].main.feels_like
    )}°C`;
    document.getElementById(
      "humidity"
    ).innerText = `${data.list[0].main.humidity}%`;
    document.getElementById(
      "wind"
    ).innerText = `${data.list[0].wind.speed} km/h`;
    document.getElementById("city-name").innerText = data.city.name;

    updateBackground(data.list[0].weather[0].main.toLowerCase());

    renderForecast(data.list);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("City not found. Please try again.");
  }
}

function updateBackground(weather) {
  let bgImage = "images/default.jpg";
  if (weather.includes("clear")) bgImage = "images/clear.jpg";
  else if (weather.includes("clouds")) bgImage = "images/clouds.jpg";
  else if (weather.includes("rain")) bgImage = "images/rain.jpg";
  else if (weather.includes("snow")) bgImage = "images/snow.jpg";
  else if (weather.includes("mist")) bgImage = "images/mist.jpg";
  else if (weather.includes("thunderstorm")) bgImage = "images/thunderstorm.jpg";

  document.body.style.backgroundImage = `url('${bgImage}')`;
}

function renderForecast(list) {
  const forecastContainer = document.getElementById("forecast");
  const hourlyContainer = document.getElementById("hourly-forecast");

  forecastContainer.innerHTML = "";
  hourlyContainer.innerHTML = "";

  const dailyForecasts = list.filter((_, index) => index % 8 === 0);
  const hourlyForecasts = list.slice(0, 8);

  dailyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleString('en-US', { weekday: 'short' });
    const dayDate = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const temp = Math.round(forecast.main.temp);
    const weather = forecast.weather[0].main.toLowerCase();
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
          <p>${day}, ${dayDate} ${month}</p>
          <img src="${icon}" alt="${weather}">
          <p>${temp}°C</p>
          <p>${weather}</p>
      `;
    forecastItem.addEventListener("click", () => {
      updateBackground(weather);
      updateCurrentWeather(forecast);
    });
    forecastContainer.appendChild(forecastItem);
  });

  hourlyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const hours = date.getHours();
    const temp = Math.round(forecast.main.temp);
    const weather = forecast.weather[0].main.toLowerCase();
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    const hourlyItem = document.createElement("div");
    hourlyItem.classList.add("forecast-item");
    hourlyItem.innerHTML = `
          <p>${hours}:00</p>
          <img src="${icon}" alt="${weather}">
          <p>${temp}°C</p>
          <p>${weather}</p>
      `;
    hourlyItem.addEventListener("click", () => {
      updateBackground(weather);
      updateCurrentWeather(forecast);
    });
    hourlyContainer.appendChild(hourlyItem);
  });
}

function updateHourlyForecast(forecast) {
  const hourlyContainer = document.getElementById("hourly-forecast");
  hourlyContainer.innerHTML = "";

  const date = new Date(forecast.dt * 1000);
  const hours = date.getHours();
  const temp = Math.round(forecast.main.temp);
  const weather = forecast.weather[0].main.toLowerCase();
  const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

  const hourlyItem = document.createElement("div");
  hourlyItem.classList.add("forecast-item");
  hourlyItem.innerHTML = `
        <p>${hours}:00</p>
        <img src="${icon}" alt="${weather}">
        <p>${temp}°C</p>
        <p>${weather}</p>
    `;
  hourlyContainer.appendChild(hourlyItem);
}

function updateDailyForecast(forecast) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const date = new Date(forecast.dt * 1000);
  const temp = Math.round(forecast.main.temp);
  const weather = forecast.weather[0].main.toLowerCase();
  const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

  const forecastItem = document.createElement("div");
  forecastItem.classList.add("forecast-item");
  forecastItem.innerHTML = `
        <p>${date.toDateString()}</p>
        <img src="${icon}" alt="${weather}">
        <p>${temp}°C</p>
        <p>${weather}</p>
    `;
  forecastContainer.appendChild(forecastItem);
}

function updateCurrentWeather(forecast) {
  document.getElementById("temperature").innerText = `${Math.round(forecast.main.temp)}°C`;
  document.getElementById("description").innerText = forecast.weather[0].description;
  document.getElementById("feels-like").innerText = `${Math.round(forecast.main.feels_like)}°C`;
  document.getElementById("humidity").innerText = `${forecast.main.humidity}%`;
  document.getElementById("wind").innerText = `${forecast.wind.speed} km/h`;
}

const cities = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar",
  "Palembang", "Bekasi", "Tangerang", "Depok", "Denpasar", "Yogyakarta",
  "Malang", "Bogor", "Batam", "Mataram", "Manado", "Banjarmasin",
  "Padang", "Jayapura", "Cilegon", "Surakarta", "Balikpapan", "Pontianak",
  "Samarinda", "Pekanbaru", "Banda Aceh", "Kediri", "Tasikmalaya", "Cirebon"
];

function showSuggestions(query) {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";
  const filteredCities = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
  filteredCities.forEach(city => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.innerText = city;
    item.addEventListener("click", () => {
      document.getElementById("city").value = city;
      suggestionBox.innerHTML = "";
      fetchWeather();
    });
    suggestionBox.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("city").addEventListener("input", (event) => {
    const query = event.target.value;
    if (query.length > 2) {
      showSuggestions(query);
    } else {
      document.getElementById("suggestions").innerHTML = "";
    }
  });

  fetchWeather();
});
