/*import axios from "axios";

export class NasaService {

  static async getMarsWeather() {

    const res = await axios.get(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    );

    return res.data;

  }

}*/

import axios from "axios";

const API_KEY = "1FTzcKd8QZ2BgbQXNTUNfRD6nxIWHNEtxO2EtN9F";

export class NasaService {

  static async getMarsData() {

    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
    );

    return {
      titulo: response.data.title,
      fecha: response.data.date,
      descripcion: response.data.explanation,
      imagen: response.data.url
    };

  }

}