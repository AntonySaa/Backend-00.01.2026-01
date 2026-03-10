import axios from "axios";

const API_KEY = "99323af505e6ffaddb2653cf6e469515";

export class WeatherService {

  static async getWeather(city) {

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    return {
      ciudad: response.data.name,
      temperatura: response.data.main.temp,
      clima: response.data.weather[0].description
    };

  }

}