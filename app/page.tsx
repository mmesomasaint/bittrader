import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Your server-side supabase helper

export default async function RootPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/(marketing)"); // Or let the route group handle it at '/'
}