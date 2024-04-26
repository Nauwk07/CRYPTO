"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { io } from "socket.io-client";

// Installation de socket.io
const socket = io();

export default function Chat() {
  const [channelName, setChannelName] = useState("Channel Placeholder");
  const [participants, setParticipants] = useState([
    "Participant 1",
    "Participant 2",
    "Participant 3",
  ]);
  const [messages, setMessages] = useState([
    { sender: "Participant 1", content: "Bonjour !" },
    { sender: "Participant 2", content: "Salut !" },
  ]);
  const [invitationLink, setInvitationLink] = useState(
    "https://example.com/invite/placeholder"
  );

  useEffect(() => {
    // Écoutez les événements socket.io pour mettre à jour les données
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (message: any) => {
    // Envoyer le message au serveur via socket.io
    socket.emit("sendMessage", message);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">{channelName}</Typography>
        <Button variant="contained" color="primary">
          Quitter
        </Button>
      </Box>
      <Box sx={{ display: "flex", height: "calc(100% - 100px)" }}>
        <Box sx={{ width: 200, p: 2, mr: 2, border: "1px solid gray" }}>
          <Typography variant="h6">Participants</Typography>
          <List>
            {participants.map((participant, index) => (
              <ListItem key={index}>{participant}</ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ flex: 1, p: 2, border: "1px solid gray" }}>
          <Typography variant="h6">Chat</Typography>
          <Box sx={{ height: "calc(100% - 32px)", overflowY: "auto" }}>
            {messages.map((message, index) => (
              <Box key={index}>
                <Typography>
                  {message.sender}: {message.content}
                </Typography>
              </Box>
            ))}
          </Box>
          {/* Ajouter un champ de saisie pour envoyer des messages */}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          Lien d'invitation: {invitationLink}
        </Typography>
      </Box>
    </Box>
  );
}