import axios from "axios";

export class UserService {

  static async getRandomUser() {

    const res = await axios.get("https://randomuser.me/api");

    return res.data;

  }

}