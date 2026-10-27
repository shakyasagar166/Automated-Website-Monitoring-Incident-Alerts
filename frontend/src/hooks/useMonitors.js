import { useState, useEffect } from 'react';
import api from '../services/api';

export function useMonitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const data = await api.getMonitors();
      setMonitors(data);
    } catch (err) {
      console.warn('Error fetching monitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  return { monitors, loading, refetch: fetchMonitors };
}
