import "./globals.css";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/attributes.css";
import { Providers } from "./Providers";
import { EditorProvider } from "@/components/editor/editor-context"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Brainstorm",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={twMerge("bg-background", inter.className)}
        suppressHydrationWarning
      >
        <Providers>
          <EditorProvider>{children}</EditorProvider>
        </Providers>
      </body>
    </html>
  );
}
