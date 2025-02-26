import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/full-logo.svg"
            width={128}
            height={38}
            className="w-full h-auto"
            priority
            alt="Eventure logo"
          ></Image>
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton />
            <MobileNav />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button className="rounded-full" size="default">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="rounded-full" size="default">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
