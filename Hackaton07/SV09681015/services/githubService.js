import axios from "axios";

export class GithubService {

    static async getUser(username) {

        const url = `https://api.github.com/users/${username}`;

        const response = await axios.get(url);

        return response.data;
    }

}