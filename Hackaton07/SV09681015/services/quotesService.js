import axios from "axios";

export class QuotesService {

  static async getQuote(){

    try{

      const response = await axios.get(
        "https://dummyjson.com/quotes/random"
      );

      return {
        cita: response.data.quote,
        autor: response.data.author
      };

    }catch(error){

      console.error("Error obteniendo cita:", error.message);
      throw error;

    }

  }

}