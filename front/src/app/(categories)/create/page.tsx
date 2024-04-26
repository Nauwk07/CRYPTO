"use client"; // Ajoutez cette directive en haut du fichier

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { apiPing, createParty } from "@/app/utils/api";
import { useRouter } from "next/navigation";

export default function CreateParty() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    partyName: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await createParty(
        {
          name: formData.partyName,
          password: formData.password,
        },
        localStorage.getItem("accessToken") ?? ""
      );
      if (response.status === 200) {
        router.push("/chat?partyroomid=" + response.data.code);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      // Gérer l'erreur ici si nécessaire
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            type="submit"
          >
            Créer le salon
          </Button>
        </form>
      </Box>
    </Box>
  );
}
