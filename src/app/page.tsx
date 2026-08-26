import { GravityStarsBackground } from "@/components/animate-ui/gravity-stars";
import { Button } from "@/components/ui/button";
import { Spade } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <GravityStarsBackground />
      </div>
      <div className="relative z-10 min-h-screen border w-full flex justify-center pt-40">
        <div className="border rounded-2xl space-x-3 h-10 p-2 flex justify-center items-center">
          <div></div>
          <div className="flex">developed by <Spade className="mx-2"/> shivamgupta951  </div>
        </div>
      </div>
    </main>
  );
}
