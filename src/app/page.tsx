"use client";

import { GravityStarsBackground } from "@/components/animate-ui/gravity-stars";
import { MorphingText } from "@/components/animate-ui/morphing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PLACEHOLDERS } from "@/lib/data";
import { Spade } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [focusActive, setfocusActive] = useState(false);
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <GravityStarsBackground />
      </div>
      <div className="relative z-10 min-h-screen border w-full flex flex-col items-center pt-20">
        <div className="rounded-2xl space-x-3 h-10 p-2 flex justify-center border-2 bg-black items-center hover:scale-105 transition-all transform duration-500 ease-in-out">
          <Badge className="bg-green-500 size-2 rounded-full ml-1"></Badge>
          <div className="flex justify-center items-center">
            developed by{" "}
            <a
              href="https://github.com/shivamgupta951"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 flex border rounded-2xl p-1 px-2 text-[75%] bg-yellow-500/10 justify-center items-center cursor-pointer hover:scale-90 transition-all transform duration-500 ease-in-out"
            >
              <Spade className="mx-2" size={18} /> shivamgupta951{" "}
            </a>{" "}
          </div>
        </div>
        <div className="my-20 text-center text-7xl">
          <div className="text-yellow-500">Forge Your Dream</div>
          <div className="border-b-4 text-8xl mt-2">With A Single Promt!</div>
        </div>
        <p className="text-2xl w-[40%] text-gray-300 text-center">
          Describe what you want to build. AI writes the code, picks the
          packages, and renders a live preview all inside your browser.
        </p>
        <div className="relative mt-20 w-[40%]">
          <Textarea
            className="w-full h-32 border-4 rounded-3xl pb-10 p-5 text-lg resize-none overflow-y-auto"
            onFocus={() => {
              setfocusActive(true);
            }}
            onBlur={() => setfocusActive(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                // enter promt generation task here ~
              }
            }}
          />

          {!focusActive && (
            <div className="absolute top-5 left-5 pointer-events-none text-gray-500">
              <MorphingText text={PLACEHOLDERS} loop={true} />
            </div>
          )}
          {focusActive && (
            <div className="absolute -top-7 transition-all transform duration-700 ease-in-out animate-in left-5 pointer-events-none text-gray-300">
              Enter Your Prompt here!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
