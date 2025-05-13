let CityName = document.getElementById('city_name');                                    //Get the city name from input field
const Srch_btn = document.getElementById('SRCH');                                       // Search button for take value from input field 
const key = '9fe09af43b9a3290033a4be17c63f86f';                                         // openweathermap API key
const currentWeather = document.getElementById('Current_weather');                      // Today weather field
const FiveDaysForcastID = document.getElementById('ForcastUpCm');                       // Upcoming 5 day weather forcast
const Humidity_vl = document.getElementById('Humidity');                                // Target Humidity
const Pressure_vl = document.getElementById('Pressure');                                // Target Pressure
const Visibility_vl = document.getElementById('Visibility');                            // Target Visiblity
const Wind_Speed_vl = document.getElementById('Wind Speed');                            // Target Wind Speed
const Feels_Like_vl = document.getElementById('Feels Like');                            // Target Feels Like
const location_btn = document.getElementById('location_btn');                           // Target Live location button



function CurrentWea(data){                                                                                      // Created function to reuse of the code used at Search button calling and used at Localstorage by which reload didn't wipe the date.
    const city = JSON.parse(localStorage.getItem('City'));
    localStorage.setItem(`Weather`, JSON.stringify(data));
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let date = new Date();
        currentWeather.innerHTML = `
        <div class="h-60 bg-indigo-300 rounded-3xl m-2 p-2 w-80% md:w-180 lg:w-150 lg:h-88">
                <div class="mt-5">
                    Now 
                </div>
                <div class="flex justify-between h-20 mt-3">
                    <div>
                        <span class="text-2xl lg:text-5xl">${(data.main.temp - 273.15).toFixed(2)} &deg;C</span>
                        <div>
                            <span>${data.weather[0].description}</span>
                        </div>
                    </div>
                    <div>
                        <img class="w-25" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="calender icon">
                    </div>
                </div>
                <hr>
                <div>
                    <img class="inline w-4" src="./images/calendar.png" alt="calender icon">
                    <span>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</span>
                </div>
                <div>
                    <img class="inline w-4" src="./images/location-pin.png" alt="Location image">
                    <span>${city}, ${data.sys.country}</span>
                </div>
            </div>
        `;
        Humidity_vl.innerHTML= `${data.main.humidity}%`;                                                    // Assign value to each highlights
        Pressure_vl.innerHTML= `${data.main.pressure}hPa`;
        Visibility_vl.innerHTML= `${data.visibility/1000}km`;
        Wind_Speed_vl.innerHTML= `${data.wind.speed}m/s`;
        Feels_Like_vl.innerHTML= `${(data.main.feels_like - 273.15).toFixed(2)} &deg;C`;
}


function ForCst(data){                                                                                  // Created function to reuse of the code used at Search button calling and used at Localstorage by which reload didn't wipe the date.
    localStorage.setItem(`Forcast`, JSON.stringify(data));
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let UniqueForcastDay = [];
        let FivedayForcast = data.list.filter(forcast => {                                                  // use filter on dates so no duplicates happen during display
            let forcastDate = new Date(forcast.dt_txt).getDate();
            if(!UniqueForcastDay.includes(forcastDate)){
                return UniqueForcastDay.push(forcastDate);
            }
        });
        FiveDaysForcastID.innerHTML = '';
        
            for(let i = 1; i<FivedayForcast.length; i++){                                                      // Once removed the duplicate use the filter output to get the data for upoming 5 days for iterate from 1 as on 0 position having current date Data.
                let date = new Date(FivedayForcast[i].dt_txt);
                FiveDaysForcastID.innerHTML += `<div class="bg-blue-400 w-60 lg:w-65 p-3 rounded-2xl m-3 flex justify-between items-center">
                        <div>
                            <span>${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}</span><br>
                            <span>${(FivedayForcast[i].main.temp - 273.15).toFixed(2)}&deg;C</span><br>
                            <span>${(FivedayForcast[i].weather[0].description)}</span><br>
                        </div>
                        <div>
                            <img class="w-22" src="https://openweathermap.org/img/wn/${FivedayForcast[i].weather[0].icon}.png" alt="Weather image">
                        </div>
                    </div>`
            }
}



if(localStorage.length !== 0){
        const data = JSON.parse(localStorage.getItem('Weather'));
        CurrentWea(data);
        const frt = JSON.parse(localStorage.getItem('Forcast'));
        ForCst(frt);
        
    }

function getWeatherDetail(name, lat, lon, country, state){
    localStorage.setItem(`City`, JSON.stringify(name));
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;           // API call to forecast to provide the upcoming 5 days weather forcast including todays weather as well
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;             // API Call to get current time and date weather forecast and many other data like wind speed , visibility, humidity etc
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {                                                           // once API return the promise it handle by then and catch for success and error
                                                                                                                            // used innerhtml to display the value of curent date in web.

        CurrentWea(data)
    }).catch(()=> {alert('Fail to fetch current weather')});

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {                                         // Above we call API that return promise so handle promise by then and catch for sucess and error
        ForCst(data)
    }).catch(()=>{alert('Unable to fetch upcoming weather data')});
}

Srch_btn.addEventListener('click',(e)=>{                                                // added event Listener on search button
    e.preventDefault();
    let City_NM = CityName.value.trim();                                                  // once the Search button it provide the city name which is mention on Input field
    CityName.value = '';
    if(!City_NM) return;                                                                  // to handle the empty input field
    let GEO_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${City_NM}&limit=1&appid=${key}`;    // API request to openweathermap to find the City position and weather
    fetch(GEO_API_URL).then(res => res.json())                                                              // API call always return promise to handle used then and Catch to handle error
    .then(data => {let {name, lat, lon, country, state} = data[0];
    getWeatherDetail(name, lat, lon, country, state);})                                                     // After recived essential detail called function with all values
    .catch(()=>{alert(`Please enter the valid City name`)});
})


location_btn.addEventListener('click',()=>{                                                                 // add event listener to the Live location button
    navigator.geolocation.getCurrentPosition(position => {                                                  // code us the get the live location of the user 
        let {latitude, longitude} = position.coords;
        let REVERSE_GEO_CORDS = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${key}`;  // put live location longitude and latitude to API to get the city and weather data.
        fetch(REVERSE_GEO_CORDS).then(res => res.json()).then(data => {                                                                 // once API call it return promise handle promise by then and catch for success and error.
            getWeatherDetail(data[0].name, data[0].lat, data[0].lon, data[0].country, data[0].state);                                   // once get all that call the function with all essential data to fetch all detail of weather.
        }).catch(()=> { alert('Unable to fetch the Live location')})
    })
})