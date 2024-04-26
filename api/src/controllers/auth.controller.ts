import { comparePassword, hashPassword } from "@utils/hash";
import { generateAccessToken } from "@utils/token";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

import User from "@models/user.model";

/**
 * La fonction de connexion vérifie si l'utilisateur existe et si le mot de passe est correct.
 * @param req - la requête HTTP
 * @param res - la réponse HTTP
 * @returns un jeton d'accès et un jeton de rafraîchissement si l'authentification est réussie.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password: reqPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await comparePassword(reqPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Générer le token d'accès
    const accessToken = generateAccessToken(user);

    // Mettre à jour le token d'accès dans la base de données
    await User.updateOne({ _id: user._id }, { accessToken });

    res.status(200).send({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

/**
 * La fonction d'inscription crée un nouvel utilisateur et envoie un email de vérification.
 * @param req - la requête HTTP
 * @param res - la réponse HTTP
 * @returns un code de vérification envoyé par email.
 */
export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { pseudo, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists");
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer un nouvel utilisateur
    const newUser = new User({
      pseudo,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).send("User created");
  } catch (error) {
    res.status(500).send("Server error");
    await User.deleteOne({ email: req.body.email }); // Supprimer l'utilisateur s'il y a une erreur
  }
};
