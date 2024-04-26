import { verifyAccessToken } from "@utils/token";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

export interface AuthRequest extends Request {
  partialUser?: {
    _id: string;
    email: string;
  };
}

/**
 * Le middleware d'authentification vérifie si un token d'accès est fourni dans le header de la requête.
 * Si le token est valide, le middleware extrait les informations de l'utilisateur du token et les ajoute à la requête.
 * Si le token est invalide, le middleware renvoie une réponse d'erreur.
 * @param {AuthRequest} req - l'objet de requête.
 * @param {Response} res - l'objet de réponse.
 * @param {NextFunction} next - la fonction middleware suivante.
 * @next passe à l'étape suivante du pipeline de requête.
 */
export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // Extraire le token du header Authorization
  const token = authorization?.includes("Bearer")
    ? authorization?.split(" ")[1]
    : authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Décoder le token d'accès
    const tokenPayload = verifyAccessToken(token);
    console.log("🚀 ~ tokenPayload:", tokenPayload)
    if (!tokenPayload?._id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Ajouter les informations de l'utilisateur à la requête
    req.partialUser = tokenPayload;
    next(); // Passer à l'étape suivante
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
