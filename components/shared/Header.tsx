import Image from "next/image";
import Link from "next/link";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/full-logo.svg"
            width={0}
            height={0}
            className="w-full h-auto"
            priority
            alt="Eventure logo"
          ></Image>
        </Link>
        <div className="flex w-32 justify-end gap-3">
            <SignedIn>
                <UserButton afterSignOutUrl="/"/>
            </SignedIn>
            <SignedOut>
                <Button asChild className="rounded-full" size="lg">
                    <Link href="/sign-in">Login / Signup</Link>
                </Button>
            </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
