import { Request, Response } from "express";
import Salon, { ISalon } from "@models/salon.model";
import crypto from "crypto";
import { AuthRequest } from "@middlewares/auth.middleware";
import { comparePassword, hashPassword } from "@utils/hash";
import User from "@models/user.model";

export const getSalon = async (req: AuthRequest, res: Response) => {
  try {
    const salonId = req.params.id;
    const userId = req.partialUser?._id;

    // Trouver le salon par son ID
    const salon = await Salon.findOne({ code: salonId });

    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    // Vérifier si l'utilisateur a rejoint le salon
    if (!salon.participants.includes(userId!)) {
      return res.status(403).send("Vous n'avez pas rejoint ce salon");
    }

    // Parse participants[] and get only pseudo and id
    const participants = await User.find({
      _id: { $in: salon.participants },
    }).select("pseudo _id");
    const createdByUser = await User.findOne({ _id: salon.createdBy }).select(
      "pseudo _id"
    );

    const currentUser = await User.findOne({
      _id: req.partialUser?._id,
    }).select("pseudo _id");

    // Parse messages[].sender into User[]
    const messages = await User.populate(salon.messages, {
      path: "sender",
      select: "pseudo _id",
    });

    const party = {
      id: salon._id,
      name: salon.name,
      code: salon.code,
      createdBy: createdByUser,
    };

    res.status(200).json({ ...party, participants, messages, currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

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

    res.status(200).json({ code: randomId });
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

    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).send("Salon introuvable");
    }

    if (salon.password && !(await comparePassword(password, salon.password))) {
      return res.status(403).send("Mot de passe incorrect");
    }

    // Vérifier si l'utilisateur a déjà rejoint le salon
    if (!salon.participants.includes(userId!)) {
      salon.participants.push(userId!);
      await salon.save();
    }

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
    salon.participants = salon.participants.filter(
      (participant) => participant.toString() !== userId
    );

    if (salon.participants.length === 0) {
      await salon.deleteOne();
      return res.status(200).send(`Le salon '${salon.name}' a été supprimé`);
    }

    await salon.save();

    res.status(200).send(`Vous avez quitté le salon '${salon.name}'`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};
