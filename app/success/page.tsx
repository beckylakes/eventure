import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function Success({ searchParams }: { searchParams: { session_id?: string } }) {
  const finalSearchParams = await searchParams;
  const sessionId = finalSearchParams.session_id;
  
  if (!sessionId) {
    return <p>Invalid session ID. Please try again.</p>;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    return (
      <section id="success">
        <p>
          Thank you for your purchase! A confirmation email has been sent to{" "}
          {session.customer_details?.email}.
        </p>
        <a href="mailto:support@example.com">Contact support</a>
      </section>
    );
  }

  return <p>Something went wrong with your order.</p>;
}
