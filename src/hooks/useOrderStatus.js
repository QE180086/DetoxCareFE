import { useState, useEffect, useRef } from 'react';
import { cartItemApi } from '../utils/api/cart-item.api';

export const useOrderStatus = (orderId, accessToken, interval = 10000) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const orderIdRef = useRef(orderId);
  const accessTokenRef = useRef(accessToken);

  // Update refs when props change
  useEffect(() => {
    orderIdRef.current = orderId;
    accessTokenRef.current = accessToken;
  }, [orderId, accessToken]);

  const checkStatus = async (currentOrderId = null) => {
    // Use the passed orderId if provided, otherwise use ref
    const effectiveOrderId = currentOrderId || orderIdRef.current;
    
    if (!effectiveOrderId || !accessTokenRef.current) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartItemApi.getOrderStatus(effectiveOrderId, accessTokenRef.current);
      
      if (response.success) {
        setStatus(response.data); // "COMPLETED" or other status
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

  const startPolling = (currentOrderId = null) => {
    // Use the passed orderId if provided, otherwise use ref
    const effectiveOrderId = currentOrderId || orderIdRef.current;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Only start if we have orderId and accessToken
    if (effectiveOrderId && accessTokenRef.current) {
      intervalRef.current = setInterval(async () => {
        const result = await checkStatus(effectiveOrderId);
        if (result === "COMPLETED") {
          stopPolling(); // Stop polling when completed
        }
      }, interval);
    }
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
    checkStatus: (currentOrderId) => checkStatus(currentOrderId),
    startPolling: (currentOrderId) => startPolling(currentOrderId),
    stopPolling
  };
};

export default useOrderStatus;