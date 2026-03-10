/*
import axios from "axios";

export class MovieService {

  static async getTopMovies() {

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        params: {
          api_key: process.env.TMDB_KEY,
          language: "es-ES",
          page: 1
        }
      }
    );

    return response.data.results;

  }

  static async getMovie(id) {

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        params: {
          api_key: process.env.TMDB_KEY,
          language: "es-ES"
        }
      }
    );

    return response.data;

  }

  static async searchMovie(query) {
    if (!query) throw new Error("Se requiere un nombre de película");

    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { ...COMMON_PARAMS, query },
    });

    const results = response.data.results;
    if (results.length === 0) throw new Error("Película no encontrada");

    return results[0]; // retorna el resultado más relevante
  }

}
  */
import "dotenv/config";
import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
const COMMON_PARAMS = {
  api_key: process.env.TMDB_KEY,
  language: "es-ES",
};

export class MovieService {

  static async getTopMovies() {
    const response = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: { ...COMMON_PARAMS, page: 1 },
    });
    return response.data.results;
  }

  static async getMovie(id) {
    const response = await axios.get(`${TMDB_BASE}/movie/${id}`, {
      params: COMMON_PARAMS,
    });
    return response.data;
  }

  static async searchMovie(query) {
    if (!query) throw new Error("Se requiere un nombre de película");

    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { ...COMMON_PARAMS, query },
    });

    const results = response.data.results;
    if (results.length === 0) throw new Error("Película no encontrada");

    return results[0];
  }

}