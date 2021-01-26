import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth/';

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "signin", {
                email,
                password
            })
            .then(response => {
                console.log(response.data);

                if (response.data.accessToken) {
                    console.log("setting user in local storage")
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            })
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(email, password) {
        return axios.post(API_URL + "signup", {
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();