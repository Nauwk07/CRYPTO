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

type User = {
  pseudo: string;
  email: string;
  password: string;
};

export const registerUser = async (data: User) => {
  try {
    const response = await api.post<User>("/auth/register", data);
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};

type Salon = {
  name: string;
  password: string;
  code: string;
  createdBy: User;
  participants: User[];
  messages: {
    sender: User;
    content: string;
    timestamp: Date;
  }[];
};

export const createParty = async (
  data: Partial<Salon>,
  accessToken: string
) => {
  try {
    const response = await api.post<Partial<Salon>>("/salons/create", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la création du salon :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};

export const joinParty = async (data: Partial<Salon>, accessToken: string) => {
  try {
    const response = await api.post("/salons/join", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la connexion au salon :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};
