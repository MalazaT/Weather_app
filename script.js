window.onload= getLocation;

function getLocation(){
    if (navagator.getLocation){
        navigator.getLocation.getCurrentPosition(showPosition,showError);

    }else{
        document.getElementById("weatherResult").innerHTML="GeaLocation not supported!";
    }
}

async function showPosition(position) {
    const lat=position.coords.latitude;
    const long=position.coords.longitude;
    const apikey="fbbee93ee91846a31c3796215f4487fe";

    const urlCurrent= 'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&long=${long}&appid=${apikey}&units=metric';
    const responseCurrent= await fetch (urlCurrent);
    const dataCurrent= await responseCurrent.json();

    document.getElementById("weatherResult").innerHTML=`
    <h2>${dataCurrent.name}</h2>
    <p>Temperature: ${dataCurrent.main.temp}C</p>
    <p>Condition: ${dataCurrent.weather[0].description}</p>
    <p>Wind: ${dataCurrent.wind.speed} m/s</p>
    `;

    const urlForecast= 'https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&long=${long}&appid=${apikey}&units=metric';
    const responseForecast=await fetch (urlForecast);
    const dataforecast= await responseForecast.json();

    let forecastHTML="";
    const dailyData= dailyforecast.list.filter(item=> item.dt_txt.includes ("12:00:00"));

    dailyData.forEach(day =>{
        const date=new Date(day.dt_txt).toLocaleDateString("en-us", {weekday: "short"});
        const icon=day.weather[0].icon;

        forecastHTML +=`
        <div class="forecast-day">
        <h4>${date}</h4>
        <img scr="https://openweathermap.org/img/wn/$/{icon}@2x.png" alt="icon">
        <p>${day.main.temp}.C</p>
        </div>
        `;

    });

    document.getElementById("forecast").innerHTML=forecastHTML;

    function showError(Error){
        document.getElementById("weartherResult").innerHTML="Location access denied. Please enter the name of your city manually.";

        async function getWeather() {
        const city= document.getElementById("cityInput").ariaValueMax;
          const apikey="fbbee93ee91846a31c3796215f4487fe";
        const urlCurrent='https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric';
        
        try{
            const reponse=await fetch(urlCurrent);
            const data=await reponse.json();

            if(data.cod===200){
                document.getElementById("weatherResult").innerHTML=`
                <h2>${data.name}</h2>
                <p>Temperature: ${data.main.temp}.C</p>
                <p>Condition: ${data.weather[0].description}</p>
                <p>wind: ${data.wind.speed} m/s</p>
                `;
            }else{
                document.getElementById("weatherResult").innerHTML="<p>City not found!...try again.</p>";
            }
        }catch (error){
            document.getElementById("weatherResult").innerHTML="<p>Error fetching data!</p>";
        }
     }
    }

}