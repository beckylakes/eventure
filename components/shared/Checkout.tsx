"use client";
import { useEffect } from "react";
import { checkoutOrder } from "@/lib/actions/order.actions";
import { Button } from "../ui/button";
import { IEvent } from "@/lib/mongodb/database/models/event.model";

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    const sessionUrl = await checkoutOrder(order);

    if (sessionUrl) {
      window.location.href = sessionUrl;
    } else {
      console.error("Failed to get a checkout session URL.");
    }
  };

  return (
    <form action={onCheckout}>
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
};

export default Checkout;
