"use client"; // Directive pour permettre les hooks React

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { loginUser } from "../utils/api";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });
      if (response.status === 200) {
        console.log("Connexion réussie");
        console.log(response.data);

        if (!response.data.accessToken) {
          console.error("Token d'accès non trouvé");
          return;
        }

        // Stocker le token d'accès dans le stockage local
        localStorage.setItem("accessToken", response.data.accessToken);
        router.push("/channel");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      // Gérer l'erreur ici si nécessaire
    }
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
          Connexion
        </Typography>
        <form onSubmit={handleSubmit}>
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
            Se connecter
          </Button>
        </form>
      </Box>
    </Box>
  );
}
