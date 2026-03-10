import axios from "axios";

export class PhotoService {

  static async searchPhotos(tema){

    try{

      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params:{
            query: tema,
            per_page: 6
          },
          headers:{
            Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
          }
        }
      );

      return response.data.results;

    }catch(error){

      console.error("Error obteniendo fotos:", error.message);
      throw error;

    }

  }

}