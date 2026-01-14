import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the maintenance/mode document
    const maintenanceDocRef = doc(db, 'maintenance', 'mode');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      maintenanceDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          // Check the ERP-GBRU field (boolean)
          setIsMaintenanceMode(data['ERP-GBRU'] || false);
        } else {
          // Document doesn't exist, assume not in maintenance mode
          setIsMaintenanceMode(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching maintenance mode:', error);
        // On error, assume not in maintenance mode
        setIsMaintenanceMode(false);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { isMaintenanceMode, loading };
};