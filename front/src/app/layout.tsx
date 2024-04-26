import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Stack } from "@mui/material";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat PTG",
  description: "Chat PTG by PTG",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Stack sx={{ width: "100%", height: "100%", flexDirection: "column" }}>
          {children}
        </Stack>
      </body>
    </html>
  );
}
