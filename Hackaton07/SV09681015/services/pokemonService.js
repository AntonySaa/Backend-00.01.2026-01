import axios from "axios";

export class PokemonService {

    static async getPokemonList() {

        const url = "https://pokeapi.co/api/v2/pokemon?limit=50";

        const response = await axios.get(url);

        return response.data;
    }

    static async getPokemon(name) {

        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

        const response = await axios.get(url);

        return response.data;
    }

}