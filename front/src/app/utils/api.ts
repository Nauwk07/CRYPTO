import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 1000,
});

export const apiPing = async () => {
  api
    .get("/ping")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createParty = async (data: any) => {
  api
    .post("/party", data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
