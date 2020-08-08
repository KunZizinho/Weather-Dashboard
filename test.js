$(document).ready(function () {

    function show(data) {

        // var lat = JSON.stringify(data.coord.lat);
        // var lon = JSON.stringify(data.coord.lon);
        // console.log("show funkcija ", lat, " lon -> ", lon)
        console.log("provjera ", data.coord.lat, data.coord.lon, data.value)

        //VRATI 
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        <p><strong>UVIndex:</strong>:${data}</p >

        `
    }

    var apiKey = "36c4284ed2168ea3cd7cb0224510b0d9";
    var cityList = [];
    var city;
    var uvIndex;

    function displayCities(cityList){
        // we are gonna empty out element  .city-list
        $(".city-list").empty();
        var list = localStorage.getItem("cityList");
        cityList = JSON.parse(list);
        // console.log("here is list ", list)

        if(list){
            // for loop that is gonna dynamically make a new tab/button with every searched city value
            for(var i = 0; i < cityList.length; i++){
                var cityTab = $("<button class=card></button>").text(cityList[i]);
                // console.log("here is cityTab ", cityTab)
                $(".city-list").prepend(cityTab);
            }
        }
    }
    
    // store searched cities on local storage
    var stored = localStorage.getItem("cityList");
    if(stored){
        cityList = JSON.parse(stored);
    } else {
        cityList = [];
    }

    $(document).on("click", ".card", function(){
        console.log("here is city when we click on the cityTab ", $(this).text())
        city = $(this).text();
        showCities(city);
    });

    $("#submitCity").on("click", function(event){
        event.preventDefault();
        city = $("#city").val();
        cityList.push(city);
        
        //set our city list in local storage so it uses JSON.stringify method
        localStorage.setItem("cityList", JSON.stringify(cityList));

        displayCities(cityList);
        if(city !== ""){
            showCities(city);
        }
    });


    function showCities(city){
        console.log("here is our param city on line 70 ", city)

        //  ajax call to get data by city name
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            type: "GET",
            success: function(data){
                console.log("city data is here ", data)
                var display = show(data);
                $("#show").html(display);
                latitude = data.coord.lat;
                longitude = data.coord.lon;
                console.log("lat is here ", latitude, " lon is here ", longitude)
                console.log(typeof(latitude), latitude.valueOf())



            }

        });

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            type: "GET",
            success: function(data){
                // console.log("forecast data is here ", data)
                var forecastDisplay =showForecast(data);
                $("#show").html(forecastDisplay);

            }
        });
        showUV();
    }



    function showUV(lat,lon){
        uvIndex;

        $.ajax({
            
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            type: "GET",
            success: function(data){
                // console.log("city data is here ", data)
                var display = show(data);
                $("#show").html(display);
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                console.log("lat is here ", lat, " lon is here ", lon)

            }

        }).then(function(data){
            lon = data.coord.lon;
            lat = data.coord.lat;
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi?appid=5650ba04d76cc8ddc64d65a07cda4c4a" + "&lat=" + lat + "&lon=" + lon,
                type: "GET",
                success: function (data) {
                    console.log("Let it be!!!!!!", 'uvIndex', data.value)
                    uvIndex = data.value;
                    console.log('uv', uvIndex)
                    return uvIndex;
                }
            })
            
        })
        console.log('uvIndex', uvIndex)
    }

    function showForecast(data){
        var forecast = data.list;
        // console.log("here is data ", data, " and here is forecast ", forecast)
        showUV(data.city);
        console.log("here is ", data.value)
        var currentForecast = []
        
        for(var i = 0; i < forecast.length; i++){
            var currentObject = forecast[i];
            var dt_time = currentObject.dt_txt.split(" ")[1];

            if(dt_time === "12:00:00"){
                var main = currentObject.main;
                var temp = main.temp;
                var humidity = main.humidity;
                var date = moment(currentObject.dt_time).format("l");
                var icon = currentObject.weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";

                // add forecast to html document
                let htmlTemplate = `
                <div class="col-sm currentCondition">
                    <div class="card">
                        <div class="card-body 5-day">
                            <p><strong>${date}</strong></p>
                            <div><img src=${iconURL} /></div>
                            <p>Temp: ${temp} °F</p>
                            <p>Humidity: ${humidity}%</p>
                            <p><strong>UV Index:</strong>:${data.city}</p>
                        </div>
                    </div>
                </div>
                `;
                currentForecast.push(htmlTemplate);
            }
        }
        $("#5-day-forecast").html(currentForecast.join(''));

    }


    displayCities(cityList);
});

/* 
1: "Zagreb"
2: "Opatija"
3: "Rijeka"
4: "Sibenik"
5: "Samobor"
6: "Zadar"
7: "Rovinj"
8: "Slavonski Brod"
9: "Omis"
10: "Sarajevo"
11: "Banja Luka"
13: "Split" 
*/