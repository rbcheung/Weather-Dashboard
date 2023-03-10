var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-button");
var APIkey = "fbc2d5bbada0f27cef0820ef96772def";
var todaySection = $("#today");
var forecastedtitle = $("#forecasted");
var forecastSection = $("#forecast");
var groupAppend = $("#group-append");
var storedCity = JSON.parse(localStorage.getItem("stored")) || [];

// function to get local storage items and create buttons that will render api data on a click.
function getStored(city) {
  localStorage.getItem("stored");

  // console.log(city);
  var historyBtn = $("<button>")
    .text(city)
    .addClass("history-btns btn btn-primary btn-block");
  $("#history").append(historyBtn);

  $("#history").on("click", function (event) {
    const cityClick = event.target.textContent;
    renderCityData(cityClick);
  });
}

for (let i = 0; i < storedCity.length; i++) {
  getStored(storedCity[i]);
}

function storeCity(cityName) {
  if (!storedCity.includes(cityName)) {
    storedCity.push(cityName);
    localStorage.setItem("stored", JSON.stringify(storedCity));
    getStored(cityName);
  }
}

// Function to get API data using Ajax and then data appended to page.
function renderCityData(cityName) {
  if (cityName) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=metric&appid=" +
      APIkey;

    storeCity(cityName);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      todaySection.empty();
      searchInput.val("");

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
        $("<p>").text("Temp:" + " " + response.main.temp + "??C")
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
        // console.log(response);
        forecastSection.empty();
        forecastedtitle.empty();
        var ftitle = $("<h4>")
          .text("5-day Forecast:")
          .attr("id", "forecast-section");
        forecastedtitle.append(ftitle);
        // console.log(ftitle);

        for (var i = 0; i < response.list.length; i += 8) {
          // console.log(response.list[i]);
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
            $("<p>").text("Temp:" + " " + response.list[i].main.temp + "??C")
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
}

// click event listener for search button. When clicked get the value from input and render data for the city chosen.
searchBtn.on("click", function (event) {
  event.preventDefault();
  var cityName = searchInput.val().trim();
  renderCityData(cityName);
});

// Event listener for enter keypress. When clicked get the value from input and render data for the city chosen.
searchInput.keypress(function (event) {
  if (event.which == 13) {
    event.preventDefault();
    var cityName = searchInput.val().trim();
    renderCityData(cityName);
  }
});

// click event listener for clear button. When clicked local storage cleared and page refreshed to show changes.
clearBtn.on("click", function () {
  localStorage.clear();
  location.reload();
});
