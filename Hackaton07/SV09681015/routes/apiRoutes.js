import express from "express";

import { GithubService } from "../services/githubService.js";
import { PokemonService } from "../services/pokemonService.js";
import { RickMortyService } from "../services/rickMortyService.js";
import { CambioService } from "../services/cambioService.js";
import { StoreService } from "../services/storeService.js";
import { CocktailService } from "../services/cocktailService.js";
import { UserService } from "../services/userService.js";
import { PhotoService } from "../services/photoService.js";
import { NasaService } from "../services/nasaService.js";
import { MovieService } from "../services/movieService.js";
import { WeatherService } from "../services/weatherService.js";
import { QuotesService } from "../services/quotesService.js";


const router = express.Router();

router.get("/github/:username", async (req, res) => {
    const data = await GithubService.getUser(req.params.username);
    res.json(data);
});


router.get("/clima/:city", async (req, res) => {
  const data = await WeatherService.getWeather(req.params.city);
  res.json(data);
});

router.get("/dolar", async (req, res) => { 
  try {
    const data = await CambioService.getUSD();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "No se pudo consultar el tipo de cambio"
    });
  }
});

router.get("/pokemon", async (req, res) => {
    const data = await PokemonService.getPokemonList();
    res.json(data);
});

router.get("/pokemon/:name", async (req, res) => {
    const data = await PokemonService.getPokemon(req.params.name);
    res.json(data);
});

router.get("/rickmorty", async (req, res) => {
    const data = await RickMortyService.getCharacters();
    res.json(data);
});

router.get("/rickmorty/:id", async (req, res) => {
    const data = await RickMortyService.getCharacter(req.params.id);
    res.json(data);
});

router.get("/cocteles", async (req, res) => {
  try {
    const data = await CocktailService.getTopCocktails();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron obtener los cocteles"
    });
  }
});

router.get("/productos", async (req, res) => {
  const data = await StoreService.getProducts();
  res.json(data);
});

router.get("/fotos/:tema", async (req, res) => {
  const data = await PhotoService.searchPhotos(req.params.tema);
  res.json(data);
});

router.get("/cita", async (req, res) => {
  try {
    const data = await QuotesService.getQuote();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "No se pudo consultar la cita"
    });
  }
});

router.get("/usuario", async (req, res) => {
  const data = await UserService.getRandomUser();
  res.json(data);
});

router.get("/peliculas", async (req, res) => {
  const data = await MovieService.getTopMovies();
  res.json(data);
});

router.get("/pelicula/buscar/:nombre", async (req, res) => {
  try {
    const data = await MovieService.searchMovie(req.params.nombre);
    res.json(data);
  } catch (error) {
    console.error("Error búsqueda:", error.message); // 👈
    const isNotFound = error.message === "Película no encontrada";
    res.status(isNotFound ? 404 : 500).json({
      error: error.message || "No se pudo buscar la película",
    });
  }
});
/*
router.get("/pelicula/buscar/:nombre", async (req, res) => {
  try {
    const data = await MovieService.searchMovie(req.params.nombre);
    res.json(data);
  } catch (error) {
    const isNotFound = error.message === "Película no encontrada";
    res.status(isNotFound ? 404 : 500).json({
      error: error.message || "No se pudo buscar la película",
    });
  }
});
*/
router.get("/pelicula/:id", async (req, res) => {
  try {
    const data = await MovieService.getMovie(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(550).json({
      error: "No se pudo consultar la película"
    });
  }
});

router.get("/marte", async (req, res) => {
  const data = await NasaService.getMarsData();
  res.json(data);
});

export default router;