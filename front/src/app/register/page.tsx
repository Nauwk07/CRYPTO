"use client"; // Directive pour permettre les hooks React

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { registerUser } from "../utils/api";
import { useRouter } from "next/navigation";

export default function registerPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await registerUser({ pseudo, email, password });
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      // Gérer l'erreur ici si nécessaire
    }

    console.log("Pseudo :", pseudo);
    console.log("Email :", email);
    console.log("Mot de passe :", password);
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
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            S'inscrire
          </Button>
        </form>
      </Box>
    </Box>
  );
}
