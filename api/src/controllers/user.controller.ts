import { AuthRequest } from "@middlewares/auth.middleware";
import { IUser } from "@models/user.model";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

import User from '@models/user.model';

/**
 * La fonction récupère tous les utilisateurs de la base de données.
 * @param req - la requête HTTP
 * @param res - la réponse HTTP
 * @returns une liste de tous les utilisateurs
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  console.log(req.partialUser);
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
};
