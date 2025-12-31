/**
 * PaymentStatusModal Component
 * Premium animated modal for payment status display
 * Mobile-First Responsive Design
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Clock, AlertCircle, X, Copy,
    Sparkles, CreditCard, Wallet, ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_STATUS } from '../hooks/useMidtrans';

// Animated Checkmark SVG
const AnimatedCheckmark = () => (
    <motion.svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 50 50">
        <motion.circle
            cx="25" cy="25" r="23"
            fill="none" stroke="url(#successGradient)" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
            d="M14 25 L22 33 L37 18"
            fill="none" stroke="url(#successGradient)" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
        />
        <defs>
            <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
        </defs>
    </motion.svg>
);

// Animated Clock
const AnimatedClock = () => (
    <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
        <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
    </motion.div>
);

// Animated Error
const AnimatedError = () => (
    <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
        <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 to-pink-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
        />
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
    </motion.div>
);

// Copy Button
const CopyButton = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 active:bg-white/20 transition-colors text-sm"
            whileTap={{ scale: 0.95 }}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300">{label}</span>
                </>
            )}
        </motion.button>
    );
};

const PaymentStatusModal = ({ isOpen, onClose, status, paymentResult }) => {
    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const getStatusContent = () => {
        switch (status) {
            case PAYMENT_STATUS.SUCCESS:
                return {
                    icon: <AnimatedCheckmark />,
                    title: 'Order Confirmed!',
                    subtitle: 'Terima kasih atas pembelian Anda',
                    glowColor: 'from-green-500/20 via-emerald-500/10 to-transparent',
                    borderColor: 'border-green-500/30'
                };
            case PAYMENT_STATUS.PENDING:
                return {
                    icon: <AnimatedClock />,
                    title: 'Waiting for Payment',
                    subtitle: 'Segera selesaikan pembayaran Anda',
                    glowColor: 'from-amber-500/20 via-orange-500/10 to-transparent',
                    borderColor: 'border-amber-500/30'
                };
            case PAYMENT_STATUS.ERROR:
                return {
                    icon: <AnimatedError />,
                    title: 'Payment Failed',
                    subtitle: 'Terjadi kesalahan saat memproses pembayaran',
                    glowColor: 'from-red-500/20 via-pink-500/10 to-transparent',
                    borderColor: 'border-red-500/30'
                };
            default:
                return null;
        }
    };

    const statusContent = getStatusContent();
    if (!statusContent) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className={`relative w-full sm:max-w-md bg-zinc-900 sm:bg-zinc-900/95 backdrop-blur-xl 
                       border-t sm:border ${statusContent.borderColor} shadow-2xl
                       rounded-t-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[85vh] sm:m-4
                       overflow-hidden flex flex-col`}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Ambient glow */}
                        <div className={`absolute inset-0 bg-gradient-radial ${statusContent.glowColor} pointer-events-none`} />

                        {/* Sparkles for success */}
                        {status === PAYMENT_STATUS.SUCCESS && (
                            <>
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute"
                                        style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 10}%` }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -20, -40] }}
                                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 2 }}
                                    >
                                        <Sparkles className="w-4 h-4 text-green-400" />
                                    </motion.div>
                                ))}
                            </>
                        )}

                        {/* Mobile Handle Bar */}
                        <div className="sm:hidden flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-zinc-600" />
                        </div>

                        {/* Close button */}
                        <motion.button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 active:bg-white/20 transition-colors z-10"
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="w-5 h-5 text-zinc-400" />
                        </motion.button>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-6 sm:p-8 text-center">
                                {/* Status Icon */}
                                <motion.div
                                    className="flex justify-center mb-5"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                >
                                    {statusContent.icon}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    className="text-xl sm:text-2xl font-bold text-white mb-2 font-outfit"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {statusContent.title}
                                </motion.h2>

                                {/* Subtitle */}
                                <motion.p
                                    className="text-zinc-400 text-sm sm:text-base mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {statusContent.subtitle}
                                </motion.p>

                                {/* Payment Details */}
                                {paymentResult && (
                                    <motion.div
                                        className="bg-white/5 rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {/* Order ID */}
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className="text-zinc-500 text-sm">Order ID</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono text-xs sm:text-sm">
                                                    {paymentResult.orderId}
                                                </span>
                                                <CopyButton text={paymentResult.orderId} label="Copy" />
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        {paymentResult.grossAmount && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 text-sm">Total</span>
                                                <span className="text-white font-semibold text-lg">
                                                    Rp {parseInt(paymentResult.grossAmount).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        {paymentResult.paymentType && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 text-sm">Metode</span>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                                    <span className="text-white capitalize text-sm">
                                                        {paymentResult.paymentType.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* VA Numbers for pending */}
                                        {status === PAYMENT_STATUS.PENDING && paymentResult.vaNumbers && paymentResult.vaNumbers.length > 0 && (
                                            <div className="pt-3 border-t border-zinc-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Wallet className="w-4 h-4 text-amber-400" />
                                                    <span className="text-amber-400 text-sm font-medium">Virtual Account</span>
                                                </div>
                                                {paymentResult.vaNumbers.map((va, index) => (
                                                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-zinc-800/50 rounded-lg gap-2">
                                                        <span className="text-zinc-400 text-sm uppercase">{va.bank}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white font-mono text-sm">{va.va_number}</span>
                                                            <CopyButton text={va.va_number} label="Copy" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Bill Key for Mandiri */}
                                        {status === PAYMENT_STATUS.PENDING && paymentResult.billKey && (
                                            <div className="pt-3 border-t border-zinc-800 space-y-2">
                                                <div className="flex items-center justify-between py-2 px-3 bg-zinc-800/50 rounded-lg">
                                                    <span className="text-zinc-400 text-sm">Biller Code</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-mono">{paymentResult.billerCode}</span>
                                                        <CopyButton text={paymentResult.billerCode} label="Copy" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between py-2 px-3 bg-zinc-800/50 rounded-lg">
                                                    <span className="text-zinc-400 text-sm">Bill Key</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-mono">{paymentResult.billKey}</span>
                                                        <CopyButton text={paymentResult.billKey} label="Copy" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Sticky Action Buttons */}
                        <div className="p-5 sm:p-6 border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl space-y-3">
                            {status === PAYMENT_STATUS.SUCCESS && (
                                <>
                                    <motion.button
                                        onClick={onClose}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Check className="w-5 h-5" />
                                        Selesai
                                    </motion.button>
                                    <p className="text-zinc-500 text-sm text-center">
                                        Kami akan mengirimkan email konfirmasi segera
                                    </p>
                                </>
                            )}

                            {status === PAYMENT_STATUS.PENDING && (
                                <>
                                    <motion.button
                                        onClick={onClose}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Saya Mengerti
                                    </motion.button>
                                    <p className="text-zinc-500 text-sm text-center">
                                        Selesaikan pembayaran dalam 1 jam
                                    </p>
                                </>
                            )}

                            {status === PAYMENT_STATUS.ERROR && (
                                <>
                                    <motion.button
                                        onClick={onClose}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Coba Lagi
                                    </motion.button>
                                    <motion.button
                                        onClick={onClose}
                                        className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium active:bg-zinc-700 transition-colors"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Hubungi Support
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentStatusModal;
