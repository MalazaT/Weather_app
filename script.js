window.onload = getLocation;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError
        );
    } else {
        document.getElementById("weatherResult").innerHTML =
            "Geolocation is not supported by this browser!";
    }
}

async function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = "ae6806d9513fae7f9a1738dfc116e221";

    try {
        // Current Weather
        const urlCurrent =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const responseCurrent = await fetch(urlCurrent);
        const dataCurrent = await responseCurrent.json();

        document.getElementById("weatherResult").innerHTML = `
            <h2>${dataCurrent.name}</h2>
            <p>Temperature: ${dataCurrent.main.temp}°C</p>
            <p>Condition: ${dataCurrent.weather[0].description}</p>
            <p>Wind: ${dataCurrent.wind.speed} m/s</p>
        `;

        // Forecast
        const urlForecast =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const responseForecast = await fetch(urlForecast);
        const dataForecast = await responseForecast.json();

        let forecastHTML = "";

        const dailyData = dataForecast.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyData.forEach(day => {
            const date = new Date(day.dt_txt).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            );

            const icon = day.weather[0].icon;

            forecastHTML += `
                <div class="forecast-day">
                    <h4>${date}</h4>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                    <p>${day.main.temp}°C</p>
                </div>
            `;
        });

        document.getElementById("forecast").innerHTML = forecastHTML;

    } catch (error) {
        document.getElementById("weatherResult").innerHTML =
            "<p>Error loading weather data.</p>";
    }
}

function showError(error) {
    document.getElementById("weatherResult").innerHTML =
        "Location access denied. Please enter your city manually.";
}

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "ae6806d9513fae7f9a1738dfc116e221";

    const urlCurrent =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(urlCurrent);
        const data = await response.json();

        if (data.cod == 200) {
            document.getElementById("weatherResult").innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${data.main.temp}°Con: ${data.weather[0].description}</p>
                <p>Wind: ${data.wind.speed} m/s</p>
            `;
        } else {
            document.getElementById("weatherResult").innerHTML =
                "<p>City not found! Try again.</p>";
        }
    } catch (error) {
        document.getElementById("weatherResult").innerHTML =
            "<p>Error fetching weather data!</p>";
    }
}