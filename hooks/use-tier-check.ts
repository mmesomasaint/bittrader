import { useUser } from "@/hooks/use-user"; // Custom hook to get user profile from Supabase

export const useTierCheck = () => {
  const { profile } = useUser();

  const isPro = profile?.tier === 'pro' || profile?.tier === 'elite';
  const isElite = profile?.tier === 'elite';

  return { tier: profile?.tier, isPro, isElite };
};