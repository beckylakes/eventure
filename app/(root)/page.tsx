import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative py-5 md:py-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-1"
        >
          <source src="/assets/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 wrapper grid grid-cols-1 gap-5 md:grid-cols-2 text-white">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Your music, your vibe—our platform makes it happen
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Looking for the perfect live event? Or ready to host your own? Our
              platform makes it easier than ever to create unforgettable
              memories.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trusted by <br/> Thousands</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          Search Date
        </div>
      </section>
    </>
  );
}
