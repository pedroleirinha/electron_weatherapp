window.$ = window.jQuery = require('jquery');

var lastSearchedCity = undefined;
const mainweatherContainer = "#results";
const dayForecastContainer = ".dayContainer";
var myLineChart;

Date.prototype.getDayFoward = function (amount) {
    this.setDate(this.getDate() + amount);
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()];
};

async function getWeather() {
    let city;

    city = arguments.length ? arguments[0] : $("#location").val();

    $(".spinner").fadeIn("fast");

    var result = await makeRequest(getRequestURL("forecast", city)).then((response => {
        $("#cityName").html(`${city.replace(city.charAt(0), city.charAt(0).toUpperCase())}`);
        showInfo(response["list"][0], mainweatherContainer, 0);

        for (let index = 0, dayCount = 0; index < response["list"].length; index += 8, dayCount++) {
            showInfo(response["list"][index], dayForecastContainer, dayCount);
        };

        addDataToChart(response["list"]);
        updateLastSearchedCity(city);
    })).catch((error) => {
        alert("Coudnt retrieve any information. try again!" + error);
    });

    $(".spinner").fadeOut("fast");
}

function getRequestURL(requestType, city) {
    const APIKEY = "9f56df1c095f61ff1204cf06c4e767ee";
    return (`http://api.openweathermap.org/data/2.5/${requestType}?q=${city}&units=metric&APPID=${APIKEY}`);
}

function addDataToChart(response) {

    removeDataFromChart();

    let hours = [], values = [];

    for (let i = 0; i < 9; i++) {
        hours[i] = response[i].dt_txt.split(" ")[1];
        values[i] = response[i]["main"].temp;
    }

    myLineChart.data.labels = hours;

    myLineChart.data.datasets[0].data = values;

    myLineChart.update();
}

function removeDataFromChart(chart) {
    myLineChart.data.labels.pop();
    myLineChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
}

function createChart() {
    var Chart = require('chart.js');

    var ctx = document.getElementById("myChart").getContext('2d');
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                backgroundColor: "rgba(209,30,30, 0.1)",
                borderColor: "#D11E1E",
                label: 'Weather'
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#e3e3e3",
                    },
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "#e3e3e3",
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    $("#myChart").hide();
}

function makeRequest(url) {
    return fetch(url)
        .then((response) => {
            return response.json();
        });
}

$(function () {
    $("#search").on("click", () => {
        getWeather();
    });

    $("#location").keyup((key) => {
        if (key.keyCode == 13) {
            getWeather();
        }

    });

    $("#refreshButton").on("click", () => {
        getWeather(lastSearchedCity);
    });

    $("#showNextDays").on("click", function () {
        $("#myChart").toggle();
        $("#nextDays").toggle();
        $(this).text($(this).text() == "Show Hourly Preview" ? "Show Next 5 Days" : "Show Hourly Preview");
    });

    getWeather("Lisbon");
    createChart();
});

function showInfo(jsonObject, container, dayNumber) {

    let temperature = jsonObject["main"]["temp"];
    let minTemp = jsonObject["main"]["temp_min"];
    let maxTemp = jsonObject["main"]["temp_max"];
    let image = `http://openweathermap.org/img/w/${jsonObject["weather"][0]["icon"]}.png`;

    $(document.querySelectorAll(`${container} #weatherImage`)[dayNumber]).attr("src", image);
    $(document.querySelectorAll(`${container} #minTemp`)[dayNumber]).html(parseInt(minTemp) + " ºC");
    $(document.querySelectorAll(`${container} #maxTemp`)[dayNumber]).html(parseInt(maxTemp) + " ºC");
    $(document.querySelectorAll(`${container} #currentTemp`)[dayNumber]).html(parseInt(temperature) + " ºC");


    $(document.querySelectorAll(`${container} #dayName`)[dayNumber]).html(new Date().getDayFoward(dayNumber));



    if (container == "#results") {
        let mainWeather = jsonObject["weather"][0]["main"];
        let weatherDescription = jsonObject["weather"][0]["description"];

        $("#mainWeather").html(mainWeather);
        $("#weatherDescription").html(weatherDescription);
    } else {

    }
}

function updateLastSearchedCity(newCity) {
    if (newCity) {
        lastSearchedCity = newCity;
    }
}

