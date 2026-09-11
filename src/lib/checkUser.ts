import { Plan } from "@/types/plans";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { PLANS } from "./constants";

const getCurrentPlan = async (): Promise<Plan> => {
  const { has } = await auth();

  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";

  return "free";
};

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const currentPlan = await getCurrentPlan();

    // 1. First find user by Clerk ID
    let existing = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    // 2. If Clerk ID is not found, try email
    //    This handles an existing Prisma user after
    //    switching/recreating the Clerk environment.
    if (!existing) {
      const email = user.emailAddresses[0]?.emailAddress;

      if (email) {
        existing = await db.user.findUnique({
          where: {
            email,
          },
        });

        // 3. Existing DB user found by email.
        //    Link it to the current Clerk account.
        if (existing) {
          existing = await db.user.update({
            where: {
              id: existing.id,
            },
            data: {
              clerkId: user.id,
              name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
              imageUrl: user.imageUrl ?? "",
            },
          });
        }
      }
    }

    // 4. Existing user found
    if (existing) {
      if (existing.plan !== currentPlan) {
        return await db.user.update({
          where: {
            id: existing.id,
          },
          data: {
            plan: currentPlan,
            credits: existing.credits + PLANS[currentPlan].credits,
          },
        });
      }

      return existing;
    }

    // 5. No existing user at all → create new user
    return await db.user.create({
      data: {
        clerkId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl ?? "",
        credits: PLANS.free.credits,
        plan: "free",
      },
    });
  } catch (error) {
    console.error("🔥 CHECK USER ERROR:", error);
    throw error;
  }
};