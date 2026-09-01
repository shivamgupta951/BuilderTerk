import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { PricingTable } from "@clerk/nextjs";

interface pricingModalTypes {
  children: React.ReactNode;
  reason?: "credits" | "upgrade";
}

const PricingModal = ({
  children,
  reason = "upgrade",
}: pricingModalTypes) => {
  const title =
    reason === "credits"
      ? "You are out of Credits."
      : "Upgrade Your Plan.";

  const description =
    reason === "credits"
      ? "You've used all your credits. Upgrade to keep building."
      : "Choose a plan that fits how much you build.";

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        {children}
      </DialogTrigger>

      <DialogContent className="min-w-7xl">
        <DialogHeader>
          <DialogTitle className="text-4xl text-blue-500">{title}</DialogTitle>

          <DialogDescription className="text-sm text-yellow-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-5xl mx-auto min-w-300 px-6 pb-6">
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
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
