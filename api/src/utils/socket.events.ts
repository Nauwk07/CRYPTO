import Salon from "@models/salon.model";
import { Schema } from "mongoose";

type Message = {
  sender: { type: Schema.Types.ObjectId; ref: "User" };
  content: string;
  code?: string;
};
export const initSocketEvents = (socket: any, io: any) => {
  socket.on("sendMessage", (message: Message) => {
    console.log("send message", message);
    Salon.findOne({ code: message.code }).then((salon) => {
      if (!salon) {
        return;
      }
      const salonMessages = salon.messages;
      console.log("🚀 ~ Salon.findOne ~ salonMessages:", salonMessages);
      const newMessage = [
        ...salonMessages,
        {
          sender: message.sender,
          content: message.content,
          timestamp: new Date(),
        },
      ];
      salon.messages = newMessage;
      salon.save();
    });
    io.emit("newMessage", message);
  });
};
