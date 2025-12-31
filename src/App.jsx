import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  MonitorSmartphone,
  HardHat,
  Zap,
  Shield,
  Bluetooth,
  ChevronRight,
  Star,
  Check,
  X,
  Menu,
  Sparkles,
  ArrowRight,
  Play,
  Volume2,
  Gauge,
  CircuitBoard,
  Bot,
  Heart,
  MessageCircle,
  Music,
  Navigation2,
  Settings,
} from 'lucide-react';

// Payment Integration
import { useMidtrans, PAYMENT_STATUS } from './hooks/useMidtrans';
import PaymentStatusModal from './components/PaymentStatusModal';
import CheckoutModal from './components/CheckoutModal';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Gradient orbs */}
    <motion.div
      className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"
      animate={{
        x: [0, -100, 0],
        y: [0, -50, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />
    {/* Grid pattern */}
    <div className="absolute inset-0 grid-pattern opacity-50" />
  </div>
);

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass py-4' : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-lg opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight">
              DASAI<span className="text-blue-500">MOCHI</span>
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Produk', 'Galeri', 'Spesifikasi', 'Harga'].map((item, index) => {
              const links = ['#features', '#gallery', '#specs', '#pricing'];
              return (
                <motion.a
                  key={item}
                  href={links[index]}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold flex items-center gap-2 glow-blue"
            >
              Pesan Sekarang
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 glass pt-24 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-6">
              {['Produk', 'Galeri', 'Spesifikasi', 'Harga'].map((item, index) => {
                const links = ['#features', '#gallery', '#specs', '#pricing'];
                return (
                  <a
                    key={item}
                    href={links[index]}
                    className="text-xl font-medium text-zinc-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                );
              })}
              <button className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                Pesan Sekarang
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Section
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
        style={{ opacity }}
      >
        {/* Left Column - Text */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-sm text-blue-400 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            ✨ Stok Terbatas — Pesan Sekarang!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-outfit text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6"
          >
            <span className="block text-white">TEMAN</span>
            <span className="block gradient-text">BERKENDARA</span>
            <span className="block text-white">KAMU</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-400 max-w-xl mb-8 leading-relaxed"
          >
            Kenalkan <span className="text-white font-semibold">Dasai Mochi</span> — robot dashboard lucu yang
            bereaksi saat kamu mengemudi, bergoyang mengikuti musik, dan
            bikin interior mobil kamu makin hidup!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] text-white font-bold text-lg flex items-center justify-center gap-3 overflow-hidden pulse-glow"
              style={{ backgroundPosition: "0% 50%" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "100% 50%"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "0% 50%"}
            >
              <span className="relative z-10">Pesan Sekarang — Rp 150rb</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
              <span className="ml-2 text-sm text-zinc-400">Dipercaya 500+ pembeli</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Product */}
        <motion.div
          style={{ y, scale }}
          className="relative"
        >
          <div className="relative aspect-square max-w-lg mx-auto">
            {/* Glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-[100px]" />

            {/* Product container */}
            <motion.div
              className="relative z-10 w-full h-full float-animation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Main product image placeholder */}
              <div className="absolute inset-8 rounded-[40px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/50 overflow-hidden shadow-2xl">
                {/* Robot face display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* OLED face simulation */}
                    <motion.div
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.5)",
                          "0 0 40px rgba(139, 92, 246, 0.5)",
                          "0 0 20px rgba(59, 130, 246, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bot className="w-16 h-16 text-white" />
                    </motion.div>

                    {/* Animated expression eyes */}
                    <motion.div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-4"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50" />
                      <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50" />
                    </motion.div>
                  </div>
                </div>

                {/* Helmet accessory preview */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="w-20 h-12 rounded-t-full bg-gradient-to-b from-zinc-600 to-zinc-700 border-2 border-zinc-500"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Floating UI elements */}
              <motion.div
                className="absolute -right-4 top-1/4 glass rounded-xl p-3 flex items-center gap-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Bluetooth className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-xs font-medium">Connected</span>
              </motion.div>

              <motion.div
                className="absolute -left-4 bottom-1/3 glass rounded-xl p-3 flex items-center gap-2"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Music className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-medium">Music Sync</span>
              </motion.div>

              <motion.div
                className="absolute right-8 bottom-8 glass rounded-xl p-3 flex items-center gap-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-medium">G-Force Mode</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-zinc-600 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// Features Bento Grid
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Cpu,
      title: "Sensor Touch",
      description: "Sentuh untuk interaksi! Dasai Mochi bereaksi lucu setiap kamu menyentuhnya. Semakin sering disentuh, semakin ekspresif!",
      gradient: "from-blue-500 to-cyan-500",
      size: "col-span-2 row-span-1",
    },
    {
      icon: MonitorSmartphone,
      title: "Layar LCD Ekspresif",
      description: "Tampilan LCD dengan berbagai ekspresi animasi yang menggemaskan dan bisa berubah-ubah.",
      gradient: "from-purple-500 to-pink-500",
      size: "col-span-1 row-span-2",
    },
    {
      icon: HardHat,
      title: "Aksesoris Helm Mini",
      description: "Dilengkapi helm mini yang bisa diganti-ganti. Cocok buat kamu pecinta otomotif!",
      gradient: "from-orange-500 to-red-500",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Volume2,
      title: "Reaktif Musik",
      description: "Dasai Mochi bisa bergoyang mengikuti irama musik di mobil kamu. Seru banget!",
      gradient: "from-green-500 to-emerald-500",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Zap,
      title: "LED RGB (Varian Colorful)",
      description: "Lampu LED warna-warni yang bikin dashboard kamu makin kece dan aesthetic.",
      gradient: "from-indigo-500 to-blue-500",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Volume2,
      title: "Speaker (Varian Ultimate)",
      description: "Dilengkapi speaker built-in untuk efek suara yang bikin Dasai makin hidup!",
      gradient: "from-zinc-400 to-zinc-600",
      size: "col-span-1 row-span-1",
    },
  ];

  return (
    <section id="features" ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
            Kenapa Harus Dasai Mochi?
          </span>
          <h2 className="font-outfit text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Fitur</span>{" "}
            <span className="gradient-text">Unggulan</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Bukan cuma pajangan biasa — Dasai Mochi adalah teman perjalanan
            yang bikin setiap trip kamu makin seru dan berkesan!
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative glass rounded-3xl p-6 md:p-8 overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${index === 0 ? 'md:col-span-2' : index === 1 ? 'md:row-span-2' : ''
                }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-outfit">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Showcase/Parallax Section
const ShowcaseSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="gallery" ref={ref} className="relative py-32 overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

      <motion.div style={{ opacity }} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image Gallery */}
          <div className="relative">
            <motion.div style={{ y: y1 }} className="relative z-20 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src="/dasaimochi_main.png"
                alt="Dasai Mochi Robot Companion"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm text-zinc-300 mb-2">Featured Product</p>
                <h3 className="text-2xl font-bold text-white font-outfit">Dasai Mochi Robot</h3>
              </div>
            </motion.div>

            <motion.div style={{ y: y2 }} className="absolute -bottom-8 -right-8 w-64 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl z-10">
              <img
                src="/dasaimochi_detail.png"
                alt="Dasai Mochi Detail View"
                className="w-full h-48 object-cover"
              />
            </motion.div>

            {/* Stats overlay */}
            <motion.div
              className="absolute top-8 -right-4 glass rounded-2xl p-4 z-30"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-bold text-white">14.2k</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Community Setups</p>
            </motion.div>
          </div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
              Testimoni Pembeli
            </span>

            <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Pembeli</span><br />
              <span className="gradient-text">Puas & Senang</span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Sudah ratusan pembeli yang puas dengan Dasai Mochi!
              Robot lucu ini jadi favorit para pecinta mobil dan motor di seluruh Indonesia.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {[
                "✅ Pengiriman cepat & aman ke seluruh Indonesia",
                "✅ Garansi uang kembali 30 hari",
                "✅ Support WhatsApp fast response",
                "✅ Bonus stiker eksklusif setiap pembelian"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-zinc-300">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full glass border border-zinc-700 text-white font-semibold flex items-center gap-2 hover:border-blue-500/50 transition-colors"
            >
              Lihat Testimoni
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// Specs Section
const SpecsSection = () => {
  const specs = [
    { label: "Ukuran", value: "80 × 65 × 90mm" },
    { label: "Berat", value: "285g" },
    { label: "Layar", value: "LCD Display" },
    { label: "Baterai", value: "Rechargeable" },
    { label: "Daya Tahan", value: "8-12 jam" },
    { label: "Charging", value: "USB Type-C" },
    { label: "Sensor", value: "Touch Sensor" },
    { label: "Material", value: "ABS Premium" },
  ];

  return (
    <section id="specs" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Detail</span>{" "}
            <span className="gradient-text">Spesifikasi</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass rounded-3xl p-6 md:p-10">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <p className="text-zinc-500 text-sm mb-1">{spec.label}</p>
              <p className="text-white font-semibold text-lg">{spec.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section with Midtrans Integration
const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState('colorful');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Midtrans payment hook
  const {
    isLoading,
    paymentStatus,
    paymentResult,
    shouldShowModal,
    processPayment,
    resetPayment
  } = useMidtrans();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Rp 150.000',
      usd: '',
      description: 'LCD 1 Warna',
      features: [
        'Dasai Mochi Robot',
        'LCD Display 1 Warna',
        'Touch Sensor Interaktif',
        'USB-C Charging Cable',
        'Garansi 6 Bulan',
      ],
      notIncluded: ['LED RGB', 'Speaker', 'Priority Support'],
    },
    {
      id: 'colorful',
      name: 'Colorful',
      price: 'Rp 180.000',
      usd: '',
      badge: 'BEST SELLER',
      description: 'LCD dengan LED Warna',
      features: [
        'Dasai Mochi Robot',
        'LCD Display Full Color',
        'LED RGB Ambient Light',
        'Touch Sensor Interaktif',
        'USB-C Charging Cable',
        'Garansi 1 Tahun',
      ],
      notIncluded: ['Speaker'],
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 'Rp 210.000',
      usd: '',
      badge: 'PREMIUM',
      description: 'LCD Warna + Speaker',
      features: [
        'Dasai Mochi Robot',
        'LCD Display Full Color',
        'LED RGB Ambient Light',
        'Built-in Speaker',
        'Music Reactive Mode',
        'Touch Sensor Interaktif',
        'USB-C Charging Cable',
        'Garansi 1 Tahun',
        'Priority Support',
      ],
      notIncluded: [],
    },
  ];

  // Handle buy button click
  const handleBuyClick = (planId) => {
    if (selectedPlan === planId) {
      setIsCheckoutOpen(true);
    } else {
      setSelectedPlan(planId);
    }
  };

  // Handle checkout confirmation
  const handleCheckoutConfirm = async (orderDetails) => {
    try {
      await processPayment(orderDetails);
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsCheckoutOpen(false);
    }
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    resetPayment();
  };

  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-sm font-medium mb-4">
            🔥 Harga Spesial Promo
          </span>
          <h2 className="font-outfit text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Pilih</span>{" "}
            <span className="gradient-text">Varian Kamu</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Gratis ongkir se-Indonesia. Garansi uang kembali 30 hari. Ready stock!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative glass rounded-3xl p-8 cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                ? 'border-2 border-blue-500 scale-[1.02]'
                : 'border border-zinc-800 hover:border-zinc-600'
                }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${plan.badge === 'LIMITED'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  } text-white`}>
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1 font-outfit">{plan.name}</h3>
                <p className="text-zinc-500 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <span className="text-5xl font-black text-white font-outfit">{plan.price}</span>
                <span className="text-zinc-500 text-sm ml-2">{plan.usd}</span>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-zinc-400" />
                    </div>
                    <span className="text-zinc-500 text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyClick(plan.id);
                }}
                className={`w-full py-4 rounded-xl font-bold transition-all ${selectedPlan === plan.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white glow-blue'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
              >
                {selectedPlan === plan.id ? 'Pesan Sekarang' : 'Pilih Paket'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-zinc-800"
        >
          {[
            { icon: Shield, text: "Pembayaran Aman" },
            { icon: Zap, text: "Pengiriman Cepat" },
            { icon: MessageCircle, text: "CS Fast Response" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-400">
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        onConfirm={handleCheckoutConfirm}
        isLoading={isLoading}
      />

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={shouldShowModal}
        onClose={handlePaymentModalClose}
        status={paymentStatus}
        paymentResult={paymentResult}
      />
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="relative py-16 border-t border-zinc-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-outfit text-xl font-bold">
              DASAI<span className="text-blue-500">MOCHI</span>
            </span>
          </div>
          <p className="text-zinc-500 max-w-sm leading-relaxed mb-4">
            Robot dashboard lucu yang bikin perjalananmu makin seru!
            Dibuat dengan ❤️ untuk para pecinta otomotif Indonesia.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-green-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-pink-500 transition-colors">
              <Heart className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Menu</h4>
          <div className="space-y-3">
            {['Produk', 'Spesifikasi', 'Harga', 'Kontak'].map((link) => (
              <a key={link} href="#" className="block text-zinc-500 hover:text-white transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">
          © 2025 Dasai Mochi Store. Made with ❤️ in Indonesia
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <span className="text-zinc-500 text-sm">📱 WhatsApp: 0812-XXXX-XXXX</span>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
function App() {
  return (
    <div className="relative min-h-screen bg-[#0f0f11] text-white overflow-x-hidden noise-overlay">
      <AnimatedBackground />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <SpecsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
