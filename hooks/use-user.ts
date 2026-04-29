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
    let channel: any;

    const fetchData = async () => {
      try {
        // 1. Get Auth User
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        if (authUser) {
          // 2. Fetch Profile and WAIT for it
          const { data: initialProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          console.log(initialProfile); // Debug line.
          setProfile(initialProfile);

          // 3. Set up Real-time listener
          channel = supabase
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
                setProfile(payload.new);
              }
            )
            .subscribe();
        }
      } catch (error) {
        console.error("Hook Error:", error);
      } finally {
        // 4. ONLY stop loading once everything (auth + profile) is done
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const isPro = profile?.tier === 'pro' || profile?.tier === 'elite';

  return { user, profile, isPro, loading };
}
