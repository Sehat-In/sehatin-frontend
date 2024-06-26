import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { UserContextProvider } from "@/components/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sehat-In",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <UserContextProvider>
            <Navbar />
            <main>
              {children}
            </main>
          </UserContextProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
