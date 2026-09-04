"use client";

import { GravityStarsBackground } from "@/components/animate-ui/gravity-stars";
import { MorphingText } from "@/components/animate-ui/morphing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { PricingTable, SignInButton, useUser } from "@clerk/nextjs";
import { ChevronRight, MessageCircle, MoveRight, Spade } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [focusActive, setfocusActive] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { isSignedIn } = useUser();
  const handleSuggestion = (s: string) => {
    setPrompt(s);
    setfocusActive(true);
  };
  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <GravityStarsBackground />
      </div>
      {/* main section page! */}
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
            className="w-full h-32 border-4 rounded-t-3xl pb-10 p-5 text-lg resize-none overflow-y-auto"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
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
          <div className="flex justify-between items-center px-5 w-full h-16 rounded-b-3xl p-2 text-sm border-4 bg-transparent border-t-0">
            <div className="text-blue-300 flex">
              Press Enter to Generate{" "}
              <div className="mx-1 text-red-300">
                & Enter + Shift to change line!{" "}
              </div>
            </div>
            {isSignedIn ? (
              <Button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className={`${prompt.trim() ? "" : "text-gray-600"}`}
              >
                Generate
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button>
                  Generate <MoveRight />
                </Button>
              </SignInButton>
            )}
          </div>
          {!focusActive && !prompt && (
            <div className="absolute top-5 left-5 pointer-events-none text-gray-500">
              <MorphingText text={PLACEHOLDERS} loop={true} />
            </div>
          )}
          {focusActive && (
            <div className="absolute -top-7 transition-all transform duration-700 ease-in-out animate-in left-5 pointer-events-none text-gray-300">
              Enter Your Prompt here!
            </div>
          )}
          <div className="w-full flex flex-wrap justify-around text-sm p-5">
            {SUGGESTIONS.map((e) => (
              <button
                className=" text-[110%] border p-2 rounded-2xl my-2 transition-all transform duration-700 ease-in-out hover:scale-105 px-4 hover:bg-linear-to-t hover:from-gray-800 hover:cursor-pointer border-yellow-200 hover:via-transparent "
                key={e}
                onClick={() => handleSuggestion(e)}
              >
                {e}
              </button>
            ))}
          </div>
          {!isSignedIn ? (
            <p className="border-t text-center text-[80%] text-gray-300">
              No credits required , 10 free generations on SignUp!
            </p>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* 2nd section page! */}
      <section id="features" className="min-h-screen flex justify-center items-center bg-linear-to-b from-[#080325] via-black to-black">
        <div className="transition-all transform duration-700 ease-in-out hover:scale-105 border w-[70%] relative bg-[#02011f] rounded-xl">
          <div className="h-14 flex justify-between items-center px-4 border-b-2">
            <div className="flex">
              <div className="rounded-full p-2 bg-red-400 mx-1"></div>
              <div className="rounded-full p-2 bg-yellow-400 mx-1"></div>
              <div className="rounded-full p-2 bg-green-400 mx-1"></div>
            </div>
            <div className="w-[90%] h-8 rounded-md border bg-gray-700 flex items-center px-3 tracking-widest text-xs">
              BuilderTerk.dev/workspace{" "}
            </div>
          </div>
          <div className="h-130 flex">
            <div className="w-[35%] border rounded-bl-md">
              <div className="h-10 border-b flex items-center px-4 text-gray-400 text-[90%]">
                Chat
              </div>
              <div className="h-[100%] flex flex-col justify-start items-center">
                <div className=" w-[100%] h-[80%]">
                  <div className="h-[50%] w-full">
                    <div className="h-[20%] w-full flex justify-end items-center px-4">
                      <div className="rounded-tr-none text-xs p-1 border px-2 rounded-md tracking-wider text-gray-300 bg-blue-900 mt-2">
                        Build me a task manager app with kanban board
                      </div>
                    </div>
                    <div className="h-[28%] mt-2 w-full  flex justify-start items-center px-4">
                      <div className="rounded-tl-none text-xs p-1 border px-2 rounded-md w-[70%] tracking-wider text-gray-300 bg-gray-900">
                        I&apos;ll create a task manager with a Kanban board. Setting
                        up the project...
                      </div>
                    </div>
                    <div className="h-[26%] w-full flex justify-start items-center px-4">
                      <div className="rounded-tl-none text-xs p-1 border px-2 rounded-md tracking-wider w-[70%] text-gray-300 bg-gray-900">
                        Installing dependencies and generating components.This
                        will be ready in a moment.{" "}
                      </div>
                    </div>
                    <div className="h-[24%] w-full flex justify-start items-center px-4">
                      <div className="rounded-tl-none flex text-xs p-1 border px-2 rounded-md tracking-widest">
                        <div className="p-[2px] rounded-xs border mx-1 bg-gray-300"></div>
                        <div className="p-[2px] rounded-xs border mx-1 bg-gray-300"></div>
                        <div className="p-[2px] rounded-xs border mx-1 bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[97%] border-t-2 h-[12%] flex justify-center items-center">
                  <div className="w-[93%] border h-9 rounded-md text-[80%] flex items-center px-4 text-gray-500">
                    Type Your Message...
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[65%] border rounded-br-md">
              <div className="border-b h-11 flex px-4 items-center">
                <div className="mx-2 text-[80%] text-gray-200 h-full flex justify-center items-center border-b-2 border-yellow-700">
                  Preview
                </div>
                <div className="mx-2 text-[80%] text-gray-200 h-full flex justify-center items-center">
                  Code
                </div>
              </div>
              <div className="flex justify-around items-center w-full h-[92%]">
                <div className="border h-[93%] w-[30%] rounded-[2%] bg-[#0a0829]">
                  <div className="text-[90%] tracking-tight h-10 flex items-center px-4 text-gray-300/70 border-b border-dashed">
                    Todo
                  </div>
                  <div className="w-full h-[91%] border flex flex-col justify-start items-center">
                    <div className="h-14 border w-[93%] mt-2 rounded-md bg-blue-950"></div>
                    <div className="h-14 border w-[93%] mt-2 rounded-md bg-blue-950"></div>
                  </div>
                </div>
                <div className="border h-[93%] w-[30%] rounded-[2%] bg-[#0a0829]">
                  <div className="text-[90%] tracking-tight h-10 flex items-center px-4 text-gray-300/70 border-b border-dashed">
                    In Progress
                  </div>
                  <div className="w-full h-[91%] border flex flex-col justify-start items-center">
                    <div className="h-14 border w-[93%] mt-2 rounded-md bg-blue-950">
                      <div className="h-full border-r-3 border-yellow-500 w-[1px] rounded-5xl"></div>
                    </div>
                  </div>
                </div>
                <div className="border h-[93%] w-[30%] rounded-[2%] bg-[#0a0829]">
                  <div className="text-[90%] tracking-tight h-10 flex items-center px-4 text-gray-300/70 border-b border-dashed">
                    Done
                  </div>
                  <div className="w-full h-[91%] border flex flex-col justify-start items-center">
                    <div className="h-14 border w-[93%] mt-2 rounded-md bg-blue-950"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-8 tracking-tight text-yellow-300 animate-bounce left-2">
            Live Preview!
          </div>
        </div>
      </section>

      {/* desc section page 3! */}
      <section className="min-h-screen flex items-center bg-linear-to-t from-[#080325] via-black to-black flex-col ">
        <div className="flex justify-center items-center h-[20%]">
          <div className="w-8 h-[2px]  bg-blue-800 mx-2"></div>
          <div className="text-yellow-300 tracking-tight text-xl">
            EVERYTHING YOU NEED
          </div>
          <div className="w-8 h-[2px] bg-blue-800 mx-2"></div>
        </div>
        <div className="text-4xl mt-7 text-center">
          <div>From prompt</div>
          <div className="text-5xl text-blue-400">to production.</div>
        </div>
        <div className="mt-28 mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-white/6 bg-black shadow-xl shadow-indigo-950 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => {
            return (
              <div
                key={label}
                className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f] rounded-2xl "
              >
                <div className="p-2 border-2 border-blue-950 w-[20%] flex justify-center items-center rounded-2xl h-14">
                  <Icon />
                </div>
                <p className="mt-4">{label}</p>
                <p className="mt-2 text-gray-400">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* how it works section page 4! */}
      <section className="min-h-screen flex items-center bg-linear-to-b pt-20 from-[#080325] via-black to-black flex-col ">
        <div className="flex justify-center items-center h-[20%]">
          <div className="w-8 h-[2px]  bg-blue-800 mx-2"></div>
          <div className="text-yellow-300 tracking-tight text-xl">
            How it works{" "}
          </div>
          <div className="w-8 h-[2px] bg-blue-800 mx-2"></div>
        </div>
        <div className="text-4xl mt-7 text-center">
          <div>Four steps</div>
          <div className="text-5xl text-blue-400">to a working app.</div>
        </div>
        <div className="max-w-3xl mx-auto mt-28">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex justify-around space-x-6 my-6 items-center h-10">
                  <div className="flex flex-col items-center h-40">
                    <span className="h-10 w-10 flex justify-center items-center rounded-4xl border font-mono text-xs font-semibold bg-blue-950/40 text-yellow-400">
                      {step.number}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="my-2 h-10 w-px bg-white/6"></div>
                    )}
                  </div>
                  <div className="h-34">
                    <div className="text-xl">{step.label}</div>
                    <div className="text-[90%] text-gray-400">{step.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing section page 5! */}
      <section className="min-h-[1300px] relative overflow-hidden flex items-center bg-linear-to-t from-[#080325] via-black to-black flex-col">
        <div className="flex justify-center items-center h-[20%]">
          <div className="w-8 h-[2px]  bg-blue-800 mx-2"></div>
          <div className="text-yellow-300 tracking-tight text-xl">
            Simple pricing
          </div>
          <div className="w-8 h-[2px] bg-blue-800 mx-2"></div>
        </div>
        <div className="text-4xl mt-3 text-center">
          <div>Start free</div>
          <div className="text-5xl text-blue-400">scale when ready.</div>
        </div>
        <p className="text-gray-400 mt-4">
          No Credit points required. Upgrade or downgrade anytime.
        </p>
        <div className="max-w-5xl mx-auto min-w-300 mb-60 mt-10">
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
              },
            }}
          />
        </div>
        <div className="w-[50%] h-100 relative">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <GravityStarsBackground starsCount={50} starsSize={2} />
          </div>

          <div className="absolute z-10 flex justify-center flex-col items-center h-full w-full">
            <div className="text-6xl mt-7 text-center">
              <div className="text-green-300">Start building</div>
              <div className="text-7xl text-indigo-600">for free.</div>
            </div>
            <p className="text-gray-400 w-[50%] text-center mt-2 mb-4">
              Get 10 free generations on sign up. No credit points required.
              Upgrade when you&apos;re ready.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="rounded-2xl">
                Get Started free
                <ChevronRight />
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/7 py-12 mx-auto px-6 flex flex-wrap items-center justify-center text-stone-400">
        Made with 💟 by Shivam!
        <a
          href="https://github.com/shivamgupta951"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-6 flex border w-40 rounded-md p-1 px-2 text-[75%] bg-yellow-500/10 justify-center items-center cursor-pointer hover:scale-90 transition-all transform duration-500 ease-in-out"
        >
          <Spade className="mx-2" size={18} /> shivamgupta951{" "}
        </a>{" "}
        <a
          href="https://www.instagram.com/shivam_gupta951/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex border w-40 rounded-md p-1 px-2 text-[75%] bg-yellow-500/10 justify-center items-center cursor-pointer hover:scale-90 transition-all transform duration-500 ease-in-out"
        >
          <MessageCircle className="mx-2" size={18} /> shivam_gupta951{" "}
        </a>{" "}
      </footer>
    </main>
  );
}
