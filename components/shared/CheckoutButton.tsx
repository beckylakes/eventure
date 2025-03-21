"use client";

import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";

const CheckoutButton = ({ event }: { event: IEvent; }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEnded = new Date(event.startDateTime) < new Date()

  return (
  <div className="flex items-center gap-3">
    {hasEnded ? (
        <p className="p-2 text-red-400">Sorry, tickets for this event are no longer available</p>
    ) : (
        <>
        <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
                <Link href="/sign-in">
                Login to Get Tickets
                </Link>
            </Button>
        </SignedOut>
        <SignedIn>
            <Checkout event={event} userId={userId} />
        </SignedIn>
        </>
    )}
  </div>);
};

export default CheckoutButton;
