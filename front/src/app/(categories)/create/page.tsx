"use client"; // Ajoutez cette directive en haut du fichier


import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function CreateParty() {
  const [formData, setFormData] = useState({
    username: '',
    partyName: '',
    password: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Logique pour créer le salon avec les données du formulaire
    console.log(formData);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
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
            label="Pseudo"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
          />
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