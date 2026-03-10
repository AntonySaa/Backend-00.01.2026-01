import axios from "axios";

export class CambioService {

  static async getUSD(){

    const response = await axios.get(
      "https://open.er-api.com/v6/latest/USD"
    );

    return {
      moneda_base: response.data.base_code,
      tipo_cambio: response.data.rates.PEN,
      fecha_actualizacion: response.data.time_last_update_utc
    };

  }

}