import { Request, Response } from "express";
import Salon, { ISalon } from "@models/salon.model";
import crypto from "crypto";
import { AuthRequest } from "@middlewares/auth.middleware";
import { comparePassword, hashPassword } from "@utils/hash";

export const createSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    const createdBy = req.partialUser?._id; // ID de l'utilisateur connecté

    // Générer un ID aléatoire de 10 caractères
    const randomId = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await hashPassword(password);

    // Créer un nouvel objet Salon
    const newSalon: ISalon = new Salon({
      name,
      password: hashedPassword,
      code: randomId,
      createdBy,
      participants: [createdBy], // Ajouter le créateur comme participant
    });

    // Enregistrer le nouveau salon dans la base de données
    await newSalon.save();

    res.status(200).send(`Le salon '${name}' a été créé avec l'ID ${randomId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur");
  }
};

export const joinSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, password } = req.body;
    const userId = req.partialUser?._id; // ID de l'utilisateur connecté

    // Trouver le salon par son ID
    const salon = await Salon.findOne({ code: code });
    console.log("🚀 ~ salon", salon);

    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    if (salon.password && !(await comparePassword(password, salon.password))) {
      return res.status(403).send("Mot de passe incorrect");
    }

    // Vérifier si l'utilisateur a déjà rejoint le salon
    if (salon.participants.includes(userId!)) {
      return res.status(400).send("Vous avez déjà rejoint ce salon");
    }

    // Ajouter l'utilisateur au salon
    salon.participants.push(userId!);
    await salon.save();

    res.status(200).send(`Vous avez rejoint le salon '${salon.name}'`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

export const leaveSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.partialUser?._id;

    // Trouver le salon par son ID
    const salon = await Salon.findOne({ code: code });

    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    // Vérifier si l'utilisateur a rejoint le salon
    if (!salon.participants.includes(userId!)) {
      return res.status(403).send("Vous n'avez pas rejoint ce salon");
    }

    // Retirer l'utilisateur du salon
    salon.participants = salon.participants.filter((id) => id !== userId);
    await salon.save();

    res.status(200).send(`Vous avez quitté le salon '${salon.name}'`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}

export const deleteSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.partialUser?._id;

    // Trouver le salon par son ID
    const salon = await Salon.findOne({ code: code });

    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    // Vérifier si l'utilisateur est le créateur du salon
    if (salon.createdBy !== userId) {
      return res.status(403).send("Vous n'êtes pas autorisé à supprimer ce salon");
    }

    // Supprimer le salon de la base de données
    await salon.deleteOne();

    res.status(200).send(`Le salon '${salon.name}' a été supprimé`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}


export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { code, content } = req.body;
    const senderId = req.partialUser?._id;

    // Trouver le salon par son ID
    const salon = await Salon.findOne({ code: code });


    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    // Vérifier si l'utilisateur a rejoint le salon
    if (!salon.participants.includes(senderId ?? "")) {
      return res.status(403).send("Vous n'avez pas rejoint ce salon");
    }

    // Vérifier si senderId est défini avant d'ajouter le message
    if (senderId) {
      // Ajouter le message au salon
      salon.messages.push({ sender: senderId, content, timestamp: new Date() });
      await salon.save();
      res.status(200).send("Message envoyé avec succès");
    } else {
      // Gérer le cas où senderId est undefined
      return res.status(401).send("Utilisateur non authentifié");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};
