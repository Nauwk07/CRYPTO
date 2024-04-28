import axios from "axios";
import bcrypt from 'bcryptjs-react';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 1000,
});

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 5; // Nombre de tours de hashage
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

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

export type User = {
  pseudo: string;
  email: string;
  password: string;
};

export const registerUser = async (data: User) => {
  try {
    data.password = await hashPassword(data.password);
    console.log(data);
    const response = await api.post<User>("/auth/register", data);
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    console.log(data);
    const response = await api.post("/auth/login", data);
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
};

export type Salon = {
  name: string;
  password: string;
  code: string;
  createdBy: User;
  participants: User[];
  nbMaxParticipants: number;
  dateAutoDestruction: number;
  currentUser?: User;
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

export const leaveParty = async (data: Partial<Salon>, accessToken: string) => {
    try {
        const response = await api.post("/salons/leave", data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
        return response; // Retourner les données de la réponse
    } catch (error) {
        console.error("Erreur lors de la sortie du salon :", error);
        throw error; // Relancer l'erreur pour qu'elle puisse être gérée
    }
}

export const fetchSalon = async (id: string, accessToken: string) => {
  try {
    const response = await api.get<Salon>(`/salons/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response; // Retourner les données de la réponse
  } catch (error) {
    console.error("Erreur lors du chargement du salon :", error);
    throw error; // Relancer l'erreur pour qu'elle puisse être gérée
  }
}