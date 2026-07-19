const ApiKey = "ac2d3435f70a5fb995317f59a3b1198a";
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".btn");
const icon = document.querySelector(".Weather_icon");

async function checkweather(city) {
  try {
    const response = await fetch(`${url}&q=${city}&appid=${ApiKey}`);

   if (!response.ok) {
    throw new Error("City not found");  }

    const data = await response.json();

    console.log(data);

    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".country").innerHTML = regionNames.of(data.sys.country);
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".Humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".speed").innerHTML = data.wind.speed + " km/hr";
    document.querySelector(".condition").innerHTML = data.weather[0].description;

    const date = new Date();

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    };

    document.querySelector(".date").innerHTML =
      date.toLocaleDateString("en-US", options);

    const weather = data.weather[0].main;

    if (weather === "Clouds") {
      icon.src = "Images/cloud.jpg";
    } else if (weather === "Clear") {
      icon.src = "Images/sunny.jpg";
    } else if (weather === "Rain") {
      icon.src = "Images/rain.jpg";
    } else if (weather === "Drizzle") {
      icon.src = "Images/drizzle.jpeg";
    } else if (weather === "Mist") {
      icon.src = "Images/mist.jpg";
    } else {
      icon.src = "Images/cloud.jpg";
    }

  } catch (error) {
    alert(error.message);
  }
}

searchbtn.addEventListener("click", () => {
  if (searchbox.value.trim() !== "") {
    checkweather(searchbox.value);
  } else {
    alert("Please enter a city name.");
  }
});

searchbox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (searchbox.value.trim() !== "") {
      checkweather(searchbox.value);
    } else {
      alert("Please enter a city name.");
    }
  }
});
