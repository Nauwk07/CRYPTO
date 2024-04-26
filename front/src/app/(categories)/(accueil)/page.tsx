import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function Page() {
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
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Bienvenue
        </Typography>
        <Link href="/create" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, mb: 2 }}
            fullWidth
          >
            Créer un salon
          </Button>
        </Link>
        <Link href="/join" passHref>
          <Button variant="outlined" color="primary" fullWidth>
            Rejoindre un salon
          </Button>
        </Link>
      </Box>
    </Box>
  );
}