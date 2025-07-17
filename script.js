document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const airQualityDisplay = document.getElementById("air-quality");
  const errorMessage = document.getElementById("error-message");
  const themeSwitch = document.getElementById("theme-switch");

  // Theme toggle
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("light");
  });

  // Press Enter to trigger search
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      getWeatherBtn.click();
    }
  });

  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    return await response.json();
  }

  async function fetchAirQuality(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Air quality fetch failed");
    const data = await response.json();
    return data.list[0].main.aqi; // 1–5
  }

  function aqiDescription(aqi) {
    switch (aqi) {
      case 1: return "Good";
      case 2: return "Fair";
      case 3: return "Moderate";
      case 4: return "Poor";
      case 5: return "Very Poor";
      default: return "Unknown";
    }
  }

  function displayWeatherData(data) {
    const { name, main, weather, coord } = data;

    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `Temperature: ${main.temp}°C`;
    descriptionDisplay.textContent = `Weather: ${weather[0].description}`;

    fetchAirQuality(coord.lat, coord.lon)
      .then((aqi) => {
        airQualityDisplay.textContent = `Air Quality Index: ${aqi} (${aqiDescription(aqi)})`;
      })
      .catch(() => {
        airQualityDisplay.textContent = `Air Quality Index: N/A`;
      });

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    cityInput.value = "";
  }

  function showError() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }
});
