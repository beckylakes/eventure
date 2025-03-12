import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp appearance={{layout: {unsafe_disableDevelopmentModeWarnings: true}}}/>;
}
