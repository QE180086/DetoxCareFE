import { useState, useEffect, useRef } from 'react';
import { cartItemApi } from '../utils/api/cart-item.api';

export const useOrderStatus = (orderId, accessToken, interval = 3000) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const checkStatus = async () => {
    if (!orderId || !accessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartItemApi.getOrderStatus(orderId, accessToken);
      
      if (response.success) {
        setStatus(response.data); // "SUCCESS" or "PENDING"
        return response.data;
      } else {
        throw new Error(response.message?.messageDetail || "Không thể kiểm tra trạng thái đơn hàng");
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (intervalRef.current) return; // Already polling
    
    intervalRef.current = setInterval(async () => {
      const result = await checkStatus();
      if (result === "SUCCESS") {
        stopPolling(); // Stop polling when success
      }
    }, interval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    status,
    loading,
    error,
    checkStatus,
    startPolling,
    stopPolling
  };
};

export default useOrderStatus;