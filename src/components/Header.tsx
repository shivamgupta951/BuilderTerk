import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ArrowRight, Book, BoxesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import PricingModal from "./PricingModal";
import { checkUser } from "@/lib/checkUser";
import { PLANS } from "@/lib/constants";
import { Plan } from "@/types/plans";

const Header = async () => {
  const user = await checkUser();
  const plan = PLANS[user?.plan as Plan] ?? PLANS.free;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 w-full items-center justify-between bg-linear-to-r from-slate-900/30 via-purple-950/60 px-10 py-8">
      <Link href={"/"}>
        <Image
          src={"/Header.png"}
          alt="logo"
          width={150}
          height={80}
          className="rounded-md"
        />
      </Link>

      <div className="flex justify-center items-center space-x-7 bg-linear-to-l p-2 px-10">
        <Show when="signed-in">
          <Link
            href={"/project"}
            className="flex space-x-5 justify-center items-center text-slate-400 border-b-2 p-1 hover:scale-90 transition transform ease-in-out duration-500"
          >
            <BoxesIcon className="mx-2" />
            Projects
          </Link>
          <Link
            href={"/#features"}
            className="flex space-x-5 justify-center items-center text-slate-400 border-b-2 p-1 hover:scale-90 transition transform ease-in-out duration-500"
          >
            <Book className="mx-2" />
            About
          </Link>
          {user && (
            <PricingModal>
              <span className="text-slate-200 rounded-2xl border-2 p-2 bg-purple-950/40">
                Credits {user.credits} / {plan.credits}
              </span>
            </PricingModal>
          )}
          <UserButton />
        </Show>

        <Show when="signed-out">
          <Link
            href={"/#features"}
            className="flex space-x-5 justify-center items-center text-slate-400 border-b-2 p-1 hover:scale-90 transition transform ease-in-out duration-500"
          >
            <Book className="mx-2" />
            About
          </Link>
          <SignInButton mode="modal">
            <Button variant={"ghost"} size="sm" className="text-slate-400">
              Sign-In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              variant={"destructive"}
              size="sm"
              className="text-slate-400 text-xl bg-pink-950/50 p-3 py-5"
            >
              Get Started <ArrowRight />
            </Button>
          </SignUpButton>
        </Show>
      </div>
    </nav>
  );
};

export default Header;
