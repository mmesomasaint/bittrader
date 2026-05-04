import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    proUsers: 0,
    totalVolume: 0,
    activeSignals: 0,
    isLoading: true
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchAdminData = async () => {
      // Get Total User Count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get Pro/Elite User Count
      const { count: proCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('tier', ['pro', 'elite']);

      // Get Aggregated Volume (Sum of all trades)
      const { data: volumeData } = await supabase
        .from('trades')
        .select('amount');
      
      const totalVol = volumeData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        proUsers: proCount || 0,
        totalVolume: totalVol,
        activeSignals: 0, // We'll hook this to a real-time subscription later
        isLoading: false
      });
    };

    fetchAdminData();
  }, []);

  return stats;
}
