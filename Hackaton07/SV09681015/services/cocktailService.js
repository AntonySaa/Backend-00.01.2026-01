/*
import axios from "axios";

export class CocktailService {

  static async getTopCocktails() {

    const res = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/popular.php"
    );

    return res.data;

  }

}
*/
export class CocktailService {

  static async getTopCocktails() {

    const response = await fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail"
    );

    const data = await response.json();

    return data;

  }

}