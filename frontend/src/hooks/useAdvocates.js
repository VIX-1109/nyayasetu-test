import { useState, useEffect } from 'react';
import { getAdvocates } from '@/services/advocateService';
import { toast } from 'sonner';

export const useAdvocates = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('all');
  const [location, setLocation] = useState('');

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      const data = await getAdvocates({ specialization, location });
      setAdvocates(data);
    } catch (error) {
      toast.error('Failed to load advocates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  return {
    advocates,
    loading,
    specialization,
    setSpecialization,
    location,
    setLocation,
    handleFilter: fetchAdvocates,
  };
};
