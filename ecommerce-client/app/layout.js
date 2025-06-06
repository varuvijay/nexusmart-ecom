import { UserWrapper } from "./context/UserContext";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/mainComponents/navbar/Navbar";
import ModalProvider from "@/components/custom/ModalProvider";
import { CustomToastProvider } from "./context/ToastContext";
import Fotter from "@/components/mainComponents/fotter/Fotter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ecommerce",
  description:
    "this is a ecommerce website where you can buy products,sell products, and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body
        id="_next"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomToastProvider>
          <UserWrapper>
            <Navbar />
            {/* <div className="border-8 h-400 w-400"></div> */}
            <ModalProvider>{children}</ModalProvider>
            <Fotter />
          </UserWrapper>
        </CustomToastProvider>
      </body>
    </html>
  );
}