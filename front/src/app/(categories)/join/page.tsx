"use client"; // Directive pour permettre les hooks React

import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { fetchSalon, joinParty } from "@/app/utils/api";

export default function JoinParty() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    invitationLink: "",
    username: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const code = formData.invitationLink.includes("partyroomid=")
                ? formData.invitationLink.split("partyroomid=")[1]
                : formData.invitationLink;

            const response = await joinParty(
                {
                    code,
                    password: formData.password,
                },
                localStorage.getItem("accessToken") ?? ""
            );
            if (response.status === 200) {
                router.push("/chat?partyroomid=" + code);
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
          Rejoindre un salon
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Lien d'invitation"
            name="invitationLink"
            value={formData.invitationLink}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mot de passe (si requis)"
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
            Rejoindre le salon
          </Button>
        </form>
      </Box>
    </Box>
  );
}
