import Image from "next/image";
import logo from "../public/logo_statsfy.png";
import { Metadata } from "next";
import { Button } from "./shared/Button";

export const metadata: Metadata = {
  title: "Statsfy | Login",
  description: "Connect with your Spotify account",
};

export default function Login() {
  return (
    <main className="flex flex-col p-6 justify-center items-center h-full gap-6">
      <Image src={logo} alt="Statsfy image" className="h-16 w-auto" />

      <div>
        <h1 className="text-2xl font-bold">
          Hello! Are you looking for your stats?
        </h1>
        <h2 className="text-xl">
          Log in with your Spotify account to see your stats
        </h2>
      </div>

      <div className="flex flex-col w-full">
        <Button>Log in with Spotify</Button>
        <Button>About the app</Button>
      </div>
    </main>
  );
}
