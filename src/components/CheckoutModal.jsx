/**
 * CheckoutModal Component
 * Premium checkout form with customer details
 * Mobile-First Responsive Design
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Mail, Phone, ShoppingBag, CreditCard,
    Loader2, Shield, CheckCircle, ChevronLeft
} from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, selectedPlan, onConfirm, isLoading }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: ''
    });
    const [errors, setErrors] = useState({});

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const PLANS = {
        basic: { name: 'Dasai Mochi - Basic', price: 150000, description: 'LCD 1 Warna' },
        colorful: { name: 'Dasai Mochi - Colorful', price: 180000, description: 'LCD dengan LED Warna' },
        ultimate: { name: 'Dasai Mochi - Ultimate', price: 210000, description: 'LCD Warna + Speaker' }
    };

    const currentPlan = PLANS[selectedPlan] || PLANS.colorful;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customer_name.trim()) newErrors.customer_name = 'Nama wajib diisi';
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            newErrors.customer_email = 'Format email tidak valid';
        }
        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Nomor telepon wajib diisi';
        } else if (!/^[0-9]{10,13}$/.test(formData.customer_phone.replace(/[^0-9]/g, ''))) {
            newErrors.customer_phone = 'Nomor telepon tidak valid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            onConfirm({ ...formData, product_type: selectedPlan, quantity: 1 });
        }
    };

    const inputClasses = (fieldName) => `
    w-full px-4 py-4 sm:py-3 rounded-xl bg-zinc-800/50 border text-base
    ${errors[fieldName] ? 'border-red-500/50' : 'border-zinc-700/50'} 
    text-white placeholder-zinc-500 
    focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
    transition-all duration-200
  `;

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
                        className="relative w-full sm:max-w-lg bg-zinc-900 sm:bg-zinc-900/95 backdrop-blur-xl 
                       border-t sm:border border-zinc-800 shadow-2xl
                       rounded-t-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[85vh] sm:m-4
                       overflow-hidden flex flex-col"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header gradient */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

                        {/* Mobile Handle Bar */}
                        <div className="sm:hidden flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-zinc-600" />
                        </div>

                        {/* Mobile Header */}
                        <div className="sm:hidden flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 relative z-10">
                            <motion.button
                                onClick={onClose}
                                className="flex items-center gap-1 text-zinc-400 active:text-white p-2 -ml-2"
                                whileTap={{ scale: 0.95 }}
                                disabled={isLoading}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="text-sm">Kembali</span>
                            </motion.button>
                            <span className="text-white font-semibold text-lg">Checkout</span>
                            <div className="w-20" />
                        </div>

                        {/* Desktop Close button */}
                        <motion.button
                            onClick={onClose}
                            className="hidden sm:flex absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5 text-zinc-400" />
                        </motion.button>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-5 sm:p-8">
                                {/* Header - Desktop only */}
                                <div className="hidden sm:flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <ShoppingBag className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-outfit">Checkout</h2>
                                        <p className="text-zinc-400 text-sm">Masukkan data untuk melanjutkan</p>
                                    </div>
                                </div>

                                {/* Selected Product Card */}
                                <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-4 sm:p-5 mb-6 border border-zinc-700/50">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-white font-semibold text-sm sm:text-base truncate">{currentPlan.name}</h3>
                                                <p className="text-zinc-500 text-xs sm:text-sm">{currentPlan.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xl sm:text-2xl font-bold text-white font-outfit">
                                                Rp {currentPlan.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                placeholder="Masukkan nama lengkap"
                                                className={`${inputClasses('customer_name')} pl-12`}
                                                disabled={isLoading}
                                                autoComplete="name"
                                            />
                                        </div>
                                        {errors.customer_name && <p className="text-red-400 text-sm mt-1">{errors.customer_name}</p>}
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleChange}
                                                placeholder="email@example.com"
                                                className={`${inputClasses('customer_email')} pl-12`}
                                                disabled={isLoading}
                                                autoComplete="email"
                                                inputMode="email"
                                            />
                                        </div>
                                        {errors.customer_email && <p className="text-red-400 text-sm mt-1">{errors.customer_email}</p>}
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Nomor WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleChange}
                                                placeholder="08xxxxxxxxxx"
                                                className={`${inputClasses('customer_phone')} pl-12`}
                                                disabled={isLoading}
                                                autoComplete="tel"
                                                inputMode="tel"
                                            />
                                        </div>
                                        {errors.customer_phone && <p className="text-red-400 text-sm mt-1">{errors.customer_phone}</p>}
                                    </div>

                                    {/* Trust Badge */}
                                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm py-2">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        <span>Pembayaran aman dengan Midtrans</span>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sticky Submit Button */}
                        <div className="p-5 sm:p-6 border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl">
                            <motion.button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`
                  w-full py-4 rounded-xl font-bold text-white text-base
                  flex items-center justify-center gap-3
                  transition-all duration-300 active:scale-[0.98]
                  ${isLoading
                                        ? 'bg-zinc-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                    }
                `}
                                whileTap={!isLoading ? { scale: 0.98 } : {}}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        <span>Lanjut ke Pembayaran</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
