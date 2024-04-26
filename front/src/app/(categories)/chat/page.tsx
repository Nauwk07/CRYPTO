"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import socket, { connectSocket } from "../../utils/socket";
import { fetchSalon, User } from "@/app/utils/api";

export default function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("partyroomid");

  const [channelName, setChannelName] = useState("Channel Placeholder");

  const [participants, setParticipants] = useState<User[]>([]);
  type Message = {
    sender: User;
    content: string;
    timestamp: string;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [invitationLink, setInvitationLink] = useState(
    "https://example.com/invite/placeholder"
  );
  const [newMessage, setNewMessage] = useState(""); // Nouveau champ pour stocker le message en cours de saisie
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    loadSalon();
  }, []);

  useEffect(() => {
    // Écoutez les événements socket.io pour mettre à jour les données
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      // Duplicate fix
      loadSalon();
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, []);

  const loadSalon = async () => {
    try {
      if (!search) return router.push("/join");

      const response = await fetchSalon(
        search,
        localStorage.getItem("accessToken") ?? ""
      );

      if (response.status === 200) {
        connectSocket();
        setParticipants(response.data.participants);
        setInvitationLink(
          `http://localhost:3000/chat?partyroomid=${response.data.code}`
        );
        setChannelName(response.data.name);
        setCurrentUser(response.data.currentUser);
        setMessages(
          response.data.messages.map((message) => ({
            ...message,
            timestamp: message.timestamp.toString(),
          }))
        );
        console.log("current User", response.data.currentUser);
        console.log("participants", response.data.participants);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du salon :", error);
      // Gérer l'erreur ici si nécessaire
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Envoyer le message au serveur via socket.io
      socket.emit("sendMessage", {
        sender: currentUser,
        content: newMessage,
        code: search,
      });
      setNewMessage(""); // Réinitialiser le champ de saisie après l'envoi du message
    }
  };

  const MessageList = () => {
    return (
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="h6">{message.sender.pseudo}</Typography>
            <Typography variant="body1">{message.content}</Typography>
            <Typography variant="caption">
              {new Date(message.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return currentUser ? (
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
              <ListItem key={index}>
                {participant.pseudo}{" "}
                {currentUser?._id === participant._id && "(Moi)"}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid gray",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Chat</Typography>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <MessageList />
          </Box>
          <Box sx={{ mt: 2, display: "flex" }}>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Entrez votre message"
              variant="outlined"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{ ml: 1 }}
            >
              Envoyer
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          Lien d'invitation: <a href={invitationLink}>{invitationLink}</a>
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography variant="h5">Chargement...</Typography>
    </Box>
  );
}
