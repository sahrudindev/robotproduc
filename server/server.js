/**
 * Dasai Mochi - Backend Payment Server
 * Secure Midtrans Payment Gateway Integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import midtransClient from 'midtrans-client';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Product configurations
const PRODUCTS = {
    basic: {
        name: 'Dasai Mochi - Basic',
        price: 150000,
        description: 'LCD 1 Warna'
    },
    colorful: {
        name: 'Dasai Mochi - Colorful',
        price: 180000,
        description: 'LCD dengan LED Warna'
    },
    ultimate: {
        name: 'Dasai Mochi - Ultimate',
        price: 210000,
        description: 'LCD Warna + Speaker'
    }
};

/**
 * Generate unique order ID
 * Format: MOCHI-{timestamp}-{random}
 */
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MOCHI-${timestamp}-${random}`;
}

/**
 * POST /api/create-transaction
 * Create Midtrans transaction and return token
 */
app.post('/api/create-transaction', async (req, res) => {
    try {
        const {
            product_type,
            quantity = 1,
            customer_name,
            customer_email,
            customer_phone
        } = req.body;

        // Validate product type
        if (!PRODUCTS[product_type]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product type. Choose: basic, colorful, or ultimate'
            });
        }

        // Validate required fields
        if (!customer_name || !customer_email || !customer_phone) {
            return res.status(400).json({
                success: false,
                message: 'Customer name, email, and phone are required'
            });
        }

        // Get product details
        const product = PRODUCTS[product_type];
        const order_id = generateOrderId();
        const gross_amount = product.price * quantity;

        // Prepare Midtrans transaction parameters
        const transactionParams = {
            transaction_details: {
                order_id: order_id,
                gross_amount: gross_amount
            },
            item_details: [{
                id: product_type,
                name: product.name,
                price: product.price,
                quantity: quantity,
                category: 'Robot Dashboard',
                merchant_name: 'Dasai Mochi Store'
            }],
            customer_details: {
                first_name: customer_name,
                email: customer_email,
                phone: customer_phone
            },
            callbacks: {
                finish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?order_id=${order_id}&status=finish`,
                unfinish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?order_id=${order_id}&status=unfinish`,
                error: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?order_id=${order_id}&status=error`
            },
            // Custom expiry: 1 hour
            expiry: {
                start_time: new Date().toISOString().slice(0, 19).replace('T', ' ') + ' +0700',
                unit: 'hour',
                duration: 1
            }
        };

        // Create transaction token
        const transaction = await snap.createTransaction(transactionParams);

        console.log(`✅ Transaction created: ${order_id} | Amount: Rp ${gross_amount.toLocaleString()}`);

        return res.status(200).json({
            success: true,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: order_id,
            amount: gross_amount
        });

    } catch (error) {
        console.error('❌ Error creating transaction:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/notification
 * Handle Midtrans payment notification webhook
 */
app.post('/api/notification', async (req, res) => {
    try {
        const notification = await snap.transaction.notification(req.body);

        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log(`📦 Payment notification: ${orderId} - Status: ${transactionStatus}`);

        // Handle different transaction statuses
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') {
                // Payment successful
                console.log(`✅ Order ${orderId}: Payment captured successfully`);
                // TODO: Update order status in database
                // TODO: Send confirmation email
            }
        } else if (transactionStatus === 'settlement') {
            // Payment settled
            console.log(`✅ Order ${orderId}: Payment settled`);
            // TODO: Update order status in database
        } else if (transactionStatus === 'pending') {
            // Payment pending
            console.log(`⏳ Order ${orderId}: Payment pending`);
        } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
            // Payment failed/cancelled/expired
            console.log(`❌ Order ${orderId}: Payment ${transactionStatus}`);
            // TODO: Update order status in database
        }

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('❌ Notification error:', error);
        res.status(500).json({ error: 'Notification handling failed' });
    }
});

/**
 * GET /api/transaction/:orderId
 * Check transaction status
 */
app.get('/api/transaction/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const status = await snap.transaction.status(orderId);

        return res.status(200).json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('❌ Error checking status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check transaction status'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
  🚀 Dasai Mochi Payment Server
  ================================
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Midtrans Mode: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX'}
  ================================
  `);
});
