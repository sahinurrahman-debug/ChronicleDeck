import { redirect } from "next/navigation";

// Write-first onboarding: the first thing an author sees is a place to start writing.
export default function Home() {
  redirect("/new");
}
