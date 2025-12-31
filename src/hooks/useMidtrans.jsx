/**
 * useMidtrans Hook
 * Custom React hook for Midtrans Snap integration
 * Handles script loading, transaction creation, and payment flow
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// Midtrans Snap configuration
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-IALfZImJUL2KJToA';
const MIDTRANS_SNAP_URL = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Payment status types
export const PAYMENT_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    PENDING: 'pending',
    ERROR: 'error',
    CANCELLED: 'cancelled'
};

/**
 * useMidtrans Hook
 * @returns {Object} - Hook state and methods
 */
export function useMidtrans() {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
    const [paymentResult, setPaymentResult] = useState(null);
    const [error, setError] = useState(null);

    // Ref to track if script is being loaded
    const scriptLoadingRef = useRef(false);

    /**
     * Load Midtrans Snap.js script dynamically
     */
    const loadMidtransScript = useCallback(() => {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.snap) {
                setIsScriptLoaded(true);
                resolve(true);
                return;
            }

            // Check if script is already in DOM
            const existingScript = document.getElementById('midtrans-snap-script');
            if (existingScript) {
                existingScript.onload = () => {
                    setIsScriptLoaded(true);
                    resolve(true);
                };
                return;
            }

            // Prevent multiple concurrent loads
            if (scriptLoadingRef.current) {
                const checkInterval = setInterval(() => {
                    if (window.snap) {
                        clearInterval(checkInterval);
                        setIsScriptLoaded(true);
                        resolve(true);
                    }
                }, 100);
                return;
            }

            scriptLoadingRef.current = true;

            // Create and inject script
            const script = document.createElement('script');
            script.id = 'midtrans-snap-script';
            script.src = MIDTRANS_SNAP_URL;
            script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
            script.async = true;

            script.onload = () => {
                setIsScriptLoaded(true);
                scriptLoadingRef.current = false;
                console.log('✅ Midtrans Snap.js loaded successfully');
                resolve(true);
            };

            script.onerror = (error) => {
                scriptLoadingRef.current = false;
                console.error('❌ Failed to load Midtrans Snap.js:', error);
                reject(new Error('Failed to load Midtrans payment script'));
            };

            document.head.appendChild(script);
        });
    }, []);

    /**
     * Create transaction on backend
     */
    const createTransaction = async (orderDetails) => {
        const response = await fetch(`${API_BASE_URL}/create-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create transaction');
        }

        return response.json();
    };

    /**
     * Process payment with Midtrans Snap
     * @param {Object} orderDetails - Order information
     */
    const processPayment = useCallback(async (orderDetails) => {
        setIsLoading(true);
        setPaymentStatus(PAYMENT_STATUS.LOADING);
        setError(null);
        setPaymentResult(null);

        try {
            // Step 1: Load Midtrans script if not already loaded
            if (!isScriptLoaded && !window.snap) {
                await loadMidtransScript();
            }

            // Step 2: Create transaction on backend
            const transaction = await createTransaction(orderDetails);

            if (!transaction.success) {
                throw new Error(transaction.message || 'Transaction creation failed');
            }

            // Step 3: Open Midtrans Snap popup
            return new Promise((resolve, reject) => {
                window.snap.pay(transaction.token, {
                    onSuccess: (result) => {
                        console.log('✅ Payment Success:', result);
                        setPaymentStatus(PAYMENT_STATUS.SUCCESS);
                        setPaymentResult({
                            orderId: result.order_id,
                            transactionId: result.transaction_id,
                            paymentType: result.payment_type,
                            grossAmount: result.gross_amount,
                            transactionTime: result.transaction_time,
                            status: 'success'
                        });
                        setIsLoading(false);
                        resolve({ status: PAYMENT_STATUS.SUCCESS, result });
                    },
                    onPending: (result) => {
                        console.log('⏳ Payment Pending:', result);
                        setPaymentStatus(PAYMENT_STATUS.PENDING);
                        setPaymentResult({
                            orderId: result.order_id,
                            transactionId: result.transaction_id,
                            paymentType: result.payment_type,
                            grossAmount: result.gross_amount,
                            vaNumbers: result.va_numbers,
                            billKey: result.bill_key,
                            billerCode: result.biller_code,
                            paymentCode: result.payment_code,
                            status: 'pending'
                        });
                        setIsLoading(false);
                        resolve({ status: PAYMENT_STATUS.PENDING, result });
                    },
                    onError: (result) => {
                        console.error('❌ Payment Error:', result);
                        setPaymentStatus(PAYMENT_STATUS.ERROR);
                        setError('Payment failed. Please try again.');
                        setPaymentResult(null);
                        setIsLoading(false);
                        reject({ status: PAYMENT_STATUS.ERROR, result });
                    },
                    onClose: () => {
                        console.log('🚪 Payment popup closed');
                        if (paymentStatus === PAYMENT_STATUS.LOADING) {
                            setPaymentStatus(PAYMENT_STATUS.CANCELLED);
                            setIsLoading(false);
                            resolve({ status: PAYMENT_STATUS.CANCELLED });
                        }
                    }
                });
            });

        } catch (err) {
            console.error('❌ Payment process error:', err);
            setPaymentStatus(PAYMENT_STATUS.ERROR);
            setError(err.message || 'An unexpected error occurred');
            setIsLoading(false);
            throw err;
        }
    }, [isScriptLoaded, loadMidtransScript]);

    /**
     * Reset payment state
     */
    const resetPayment = useCallback(() => {
        setPaymentStatus(PAYMENT_STATUS.IDLE);
        setPaymentResult(null);
        setError(null);
        setIsLoading(false);
    }, []);

    /**
     * Check if modal should be shown
     */
    const shouldShowModal = [
        PAYMENT_STATUS.SUCCESS,
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.ERROR
    ].includes(paymentStatus);

    return {
        // State
        isScriptLoaded,
        isLoading,
        paymentStatus,
        paymentResult,
        error,
        shouldShowModal,

        // Methods
        processPayment,
        resetPayment,
        loadMidtransScript
    };
}

export default useMidtrans;
