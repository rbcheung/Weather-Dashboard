var searchInput = $("#search-input");
// console.log(searchInput);
var searchBtn = $("#search-button");
// console.log(searchBtn);
var APIkey = "fbc2d5bbada0f27cef0820ef96772def";

var todaySection = $("#today");
var forecastedtitle = $("#forecasted");
var forecastSection = $("#forecast");
var groupAppend = $("#group-append");
var storedCity = JSON.parse(localStorage.getItem("stored")) || [];

function getStored() {
  localStorage.getItem("stored");
    for (i = 0; i < storedCity.length; i++) {
      console.log(storedCity[i]);
      var historyBtn = $("<button>").text(storedCity[i]);
      $("#history").append(historyBtn);
    }
  }

function storeCity() {
  localStorage.setItem("stored", JSON.stringify(storedCity));
}

function renderCityData() {
  searchBtn.on("click", function (event) {
    event.preventDefault();
    todaySection.empty();
    forecastSection.empty();
    forecastedtitle.empty();
    var cityName = searchInput.val().trim();

    if (cityName) {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=metric&appid=" +
        APIkey;
      storedCity.push(cityName);
      storeCity()
      getStored();

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);

        todaySection.addClass("today");
        var currentDate = moment.unix(response.dt).format("MM/DD/YYYY");
        var currentWeather = $("<h2>").text(response.name + " " + currentDate);

        todaySection.append(currentWeather);
        currentWeather.append(
          $("<img>").attr(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.weather[0].icon +
              "@2x.png"
          )
        );
        todaySection.append(
          $("<p>").text("Temp:" + " " + response.main.temp + "°C")
        );
        todaySection.append(
          $("<p>").text("Wind:" + " " + response.wind.speed + " " + "mps")
        );
        todaySection.append(
          $("<p>").text("Humidity:" + " " + response.main.humidity + "%")
        );

        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`,
          method: "GET",
        }).then(function (response) {
          console.log(response);
          var ftitle = $("<h4>")
            .text("5-day Forecast:")
            .attr("id", "forecast-section");
          forecastedtitle.append(ftitle);
          console.log(ftitle);

          for (var i = 0; i < response.list.length; i += 8) {
            console.log(response.list[i]);
            var futureDate = moment
              .unix(response.list[i].dt)
              .format("MM/DD/YYYY");
            var forecastedWeather = $("<p>").text(futureDate);

            var forecastDiv = $("<div>").addClass("card-div");
            forecastSection.append(forecastDiv);
            forecastDiv.append(forecastedWeather);
            forecastDiv.append(
              $("<img>").attr(
                "src",
                "https://openweathermap.org/img/wn/" +
                  response.list[i].weather[0].icon +
                  "@2x.png"
              )
            );
            forecastDiv.append(
              $("<p>").text("Temp:" + " " + response.list[i].main.temp + "°C")
            );
            forecastDiv.append(
              $("<p>").text(
                "Wind:" + " " + response.list[i].wind.speed + " " + "mps"
              )
            );
            forecastDiv.append(
              $("<p>").text(
                "Humidity:" + " " + response.list[i].main.humidity + "%"
              )
            );
          }
        });
      });
    }
  });
}
renderCityData();
