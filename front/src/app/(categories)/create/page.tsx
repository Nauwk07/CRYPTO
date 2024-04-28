"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { apiPing, createParty, hashPassword } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { time } from "console";

export default function CreateParty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    partyName: "",
    password: "",
    deleteDate: "", // Nouveau champ pour la date de suppression
    nbMaxParticipants: "", // Nouveau champ pour le nombre maximum de participants
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log("Création du salon", new Date(formData.deleteDate).getTime());
      const hashedPassword = await hashPassword(formData.password);
      const response = await createParty(
        {
          name: formData.partyName,
          password: hashedPassword,
          dateAutoDestruction: new Date(formData.deleteDate).getTime(),
          nbMaxParticipants: parseInt(formData.nbMaxParticipants),
        },
        localStorage.getItem("accessToken") ?? ""
      );
      if (response.status === 200) {
        router.push("/chat?partyroomid=" + response.data.code);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
    console.log(formData);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Créer un salon
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nom du salon"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date de suppression automatique"
            name="deleteDate"
            type="date"
            value={formData.deleteDate}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nombre maximum de participants"
            name="maxParticipants"
            type="number"
            value={formData.nbMaxParticipants}
            onChange={handleChange}
            variant="outlined"
          />
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            Créer le salon
          </Button>
        </form>
      </Box>
    </Box>
  );
}
