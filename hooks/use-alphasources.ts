import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useAlphaSources() {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch existing sources
  const fetchSources = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('alpha_sources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error) setSources(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchSources(); }, []);

  // Add Source (Includes the Twitter ID lookup placeholder)
  const addSource = async (handle: string) => {
    const cleanHandle = handle.replace('@', '').trim();
    if (!cleanHandle) return;

    // For now, we'll store the handle and let the backend resolve the ID
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('alpha_sources')
      .insert([{ user_id: user.id, handle: cleanHandle }])
      .select()
      .single();

    if (error) {
      toast.error("SOURCE_EXISTS_OR_ERROR");
    } else {
      setSources([...sources, data]);
      toast.success("ALPHA_SOURCE_LINKED");
    }
  };

  // Remove Source
  const removeSource = async (id: string) => {
    const { error } = await supabase
      .from('alpha_sources')
      .delete()
      .eq('id', id);

    if (!error) {
      setSources(sources.filter(s => s.id !== id));
      toast.success("SOURCE_REMOVED");
    }
  };

  return { sources, addSource, removeSource, isLoading };
}
