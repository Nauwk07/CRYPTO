import * as dotenv from "dotenv";
import {IUser} from '@models/user.model';
import jwt, { Secret } from "jsonwebtoken";
dotenv.config();

const { JWT_ACCESS_SECRET } = process.env;

/**
 * La fonction génère un jeton d'accès à l'aide de l'ID d'un utilisateur et d'un secret d'API.
 * @param {IUser} user - un objet de type `IUser`. Il représente l'utilisateur pour lequel le jeton d'accès est généré.
 * @returns un jeton JSON Web (JWT) qui contient l'ID de l'utilisateur et son email.
 */
export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: "1d",
    }
  );
};


export interface TokenPayload {
  _id: string;
  email: string;
}

/**
 * La fonction vérifie un jeton d'accès.
 * @param {string} accessToken - une chaîne qui représente le jeton d'accès à vérifier.
 * @returns le jeton décodé s'il est valide; sinon, il renvoie null.
 */
export const verifyAccessToken = (accessToken: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    ) as TokenPayload;
    return {
      _id: decoded._id,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
};
