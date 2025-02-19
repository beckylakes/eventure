import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="block md:hidden"> {/* Show on mobile only */}
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <SheetTitle>
            <Image src="/assets/images/full-logo.svg" alt="logo" width={118} height={38} className="m-5 mx-auto"/>
            <Separator className="border border-gray" />
            <NavItems />
          </SheetTitle>
        </SheetContent>
      </Sheet>
    </nav>
  );
};


export default MobileNav;
