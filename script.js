$(document).ready(function () {



    // FUNKCIJA SHOW SA PARAMETROM DATA
    function show(data) {

        var lat = "";
        var lon = "";

        //VRATI 
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        <p><strong>UVIndex:</strong>:${data.city}</p >

        `
    }

    function showUV(lat, lon) {

        var apiKey = "36c4284ed2168ea3cd7cb0224510b0d9";
        console.log(lat)
        console.log(lon)
        //  lat.JSON.stringify().val(); 
        //  lon.JSON.stringify().val();

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "}&lat=" + lat + "&lon=" + lon,
            type: "GET",
            sucess: function (data) {
                console.log(data)
                // var uvDisplay = showUV(data);
                //console.log(uvDisplay, "uvDisplay");
            }
        });
        // console.log(data)
        // return `
        // <p><strong>UV Index:</strong>:${data.value}</p>

        // `
    }

    $(document).on("click", ".card", function () {
        console.log("working");
        console.log($(this).text())
        var city = $(this).text();
        zizitop(city);
    })


    function displayCities(cityList) {
        $('.city-list').empty();
        var list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        // returning as a string, find javascript function to parse cityList
        if (list) {
            for (var i = 0; i < cityList.length; i++) {
                var container = $("<button class=card></button>").text(cityList[i]);
                $('.city-list').prepend(container);
            }
        }
    }

    function showForecast(data) {
        var forecast = data.list; // [{},{},{}]
        // We have an array of 40 objects
        // We want every 5th object's date, icon, temp, humidity (index 4)
        // Display date, icon, temp and humidity via html
        // LOGIC:
        // Loop over array
        console.log(data)
        showUV(data.city.coord);
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {

            var currentObject = forecast[i];
            // First time through loop - 0: {}
            // Second time through loop - 1: {}
            // Third time through loop - 2: {}

            var dt_time = currentObject.dt_txt.split(' ')[1] // '12:00:00'[1 is the number of index]
            // At each index..If...dt_txt === "12:00:00" get info
            if (dt_time === "12:00:00") {
                // currentObject.main ... time, icon, temp, humidity
                var main = currentObject.main;
                // Store each of these in variables
                var temp = main.temp; // TODO: Convert to F
                var humidity = main.humidity;
                var date = moment(currentObject.dt_txt).format('l'); // TODO: Use MomentJS to convert
                var icon = currentObject.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";


                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                    <p><strong>UV Index:</strong>:${data.city}</p>
                    
                    
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }

        }
        $("#5-day-forecast").html(currentForecast.join(''));

    }

    // METHODS

    var stored = localStorage.getItem("cityList")
    if (stored) {
        cityList = JSON.parse(stored)
    } else {
        cityList = []
    }
    //var cityList = [];
    $('#submitCity').click(function (event) {
        event.preventDefault();
        var city = $('#city').val();
        // push city to cityList array
        cityList.push(city);
        // set cityList in localStorage (remember to use stringify!)
        localStorage.setItem("cityList", JSON.stringify(cityList));
        // check length of array. if > 5 then don't add.
        displayCities(cityList);
        if (city != '') {
            zizitop(city);
            //     $.ajax({
            //         url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            //         type: "GET",
            //         success: function (data) {
            //             var display = show(data);
            //             $("#show").html(display);
            //         }
            //     });

            //     $.ajax({
            //         url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            //         type: "GET",
            //         success: function (data) {
            //             var forecastDisplay = showForecast(data)
            //             // add to page
            //         }
            //     });

            //     $.ajax({
            //         url: "https://api.openweathermap.org/data/2.5/uvi?appid=5650ba04d76cc8ddc64d65a07cda4c4a&lat=" + lat + "&lon=" + lon,
            //         type: "GET",
            //         sucess: function (data) {
            //             var uvDisplay = showUV(data);
            //             console.log(uvDisplay, "uvDisplay");
            //         }
            //     });

        }
        //else {
        //     $('#error').html('Please insert a city name:');
        // }
    });

    function zizitop(city) {
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            type: "GET",
            success: function (data) {
                console.log(data)
                var display = show(data);
                $("#show").html(display);
            }
        });

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
            type: "GET",
            success: function (data) {
                var forecastDisplay = showForecast(data)
                // add to page
            }
        });
        showUV();
        // $.ajax({
        //     url: "https://api.openweathermap.org/data/2.5/uvi?appid=5650ba04d76cc8ddc64d65a07cda4c4a&lat=" + lat + "&lon=" + lon,
        //     type: "GET",
        //     sucess: function (data) {
        //         console.log(data)
        //         var uvDisplay = showUV(data);
        //         console.log(uvDisplay, "uvDisplay");
        //     }
        // });
    }
    displayCities(cityList);

});