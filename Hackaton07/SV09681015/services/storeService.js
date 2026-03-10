import axios from "axios";

export class StoreService {

  static async getProducts() {

    const res = await axios.get("https://fakestoreapi.com/products");

    return res.data;

  }

}