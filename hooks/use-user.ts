"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        // 1. Initial Fetch
        const { data: initialProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        setProfile(initialProfile);

        // 2. Real-time Subscription
        // This listens for any UPDATE to YOUR row in the profiles table
        const channel = supabase
          .channel(`profile-updates-${authUser.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${authUser.id}`,
            },
            (payload) => {
              console.log("Profile Sync Active: New Tier Detected", payload.new.tier);
              setProfile(payload.new);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
      setLoading(false);
    };

    fetchData();
  }, []); // Re-runs if auth state changes

  const isPro = profile?.tier === 'pro' || profile?.tier === 'elite';

  return { user, profile, isPro, loading };
}
