import axios from "axios";

export class RickMortyService {

    static async getCharacters() {

        const url = "https://rickandmortyapi.com/api/character";

        const response = await axios.get(url);

        return response.data;
    }

    static async getCharacter(id) {

        const url = `https://rickandmortyapi.com/api/character/${id}`;

        const response = await axios.get(url);

        return response.data;
    }

}