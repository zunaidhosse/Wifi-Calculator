import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Languages, Smartphone, Calculator, CheckCircle2, Download, MoreVertical, Share2, ExternalLink, X, ChevronRight, Phone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toPng } from 'html-to-image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations = {
  en: {
    title: "Wifi Calculator",
    width: "Width",
    sideLength: "Side Length",
    multiplier: "Multiplier",
    singlePart: "Single Part",
    doublePart: "Double Part",
    calculate: "Calculate",
    install: "Install App",
    enterSide: "Enter side in meters",
    enterMultiplier: "Enter multiplier",
    meters: "meters",
    need: "need",
    buttons: "buttons",
    part: "part",
    download: "Download Result",
    noJoin: "No Join",
    pairs: "pairs",
    more: "More",
    helpline: "Helpline",
    onlineShop: "Online Shop",
    supportAndInfo: "Support & Info",
    contactDescription: "Contact us directly",
    shopDescription: "Our furniture shop",
    share: "Share App",
    changeLang: "Language",
    alert: "Please enter valid positive numbers. If the issue persists, contact me directly on WhatsApp: +9660581991368\n(Name: Zunaid Hossen Meraj).",
    designer: "Designed by ZunaidHossen Miraz"
  },
  bn: {
    title: "ওয়াইফাই ক্যালকুলেটর",
    width: "প্রস্থ",
    sideLength: "পার্শ্ব দৈর্ঘ্য",
    multiplier: "গুণক",
    singlePart: "এক পার্ট",
    doublePart: "দুই পার্ট",
    calculate: "হিসাব করুন",
    install: "অ্যাপ ইনস্টল করুন",
    enterSide: "মিটারে পার্শ্ব প্রবেশ করান",
    enterMultiplier: "গুণক প্রবেশ করান",
    meters: "মিটার",
    need: "প্রয়োজন",
    buttons: "বাটন",
    part: "পার্ট",
    download: "ডাউনলোড করুন",
    noJoin: "নো জয়েন",
    pairs: "পেয়ার",
    more: "আরও",
    helpline: "হেল্পলাইন",
    onlineShop: "অনলাইন শপ",
    supportAndInfo: "সহযোগিতা ও তথ্য",
    contactDescription: "সরাসরি যোগাযোগ করুন",
    shopDescription: "আমাদের ফার্নিচার শপ",
    share: "অ্যাপ শেয়ার",
    changeLang: "ভাষা",
    alert: "অনুগ্রহ করে সঠিক ধনাত্মক সংখ্যা প্রবেশ করান। সমস্যা থাকলে, আমার সাথে সরাসরি WhatsApp এ যোগাযোগ করুন: +9660581991368\n(নাম: জুনাইদ হোসেন মিরাজ)।",
    designer: "ডিজাইন করেছেন জুনাইদ হোসেন মিরাজ"
  },
  ar: {
    title: "حاسبة الواي فاي",
    width: "العرض",
    sideLength: "طول الجانب",
    multiplier: "المضاعف",
    singlePart: "جزء واحد",
    doublePart: "جزئين",
    calculate: "احسب",
    install: "تثبيت التطبيق",
    enterSide: "أدخل الجانب بالأمتار",
    enterMultiplier: "أدخل المضاعف",
    meters: "متر",
    need: "مطلوب",
    buttons: "أزرار",
    part: "جزء",
    download: "تحميل النتيجة",
    noJoin: "بدون خياطة",
    pairs: "أزواج",
    more: "المزيد",
    helpline: "خط المساعدة",
    onlineShop: "المتجر الإلكتروني",
    supportAndInfo: "الدعم والمعلومات",
    contactDescription: "اتصل بنا مباشرة",
    shopDescription: "متجر الأثاث الخاص بنا",
    share: "مشاركة التطبيق",
    changeLang: "اللغة",
    alert: "الرجاء إدخال أرقام موجبة صحيحة. إذا استمرت المشكلة، تواصل معي مباشرة على WhatsApp: +9660581991368\n(الاسم: زنيد حسين ميراج).",
    designer: "تم التصميم بواسطة جنيد حسين ميراج"
  }
};

type Language = keyof typeof translations;

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'bn';
  });
  const [width, setWidth] = useState<string>('1.40');
  const [side, setSide] = useState<string>('');
  const [multiplier, setMultiplier] = useState<string>('');
  const [isDoublePart, setIsDoublePart] = useState<boolean>(false);
  const [isNoJoin, setIsNoJoin] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [results, setResults] = useState<{
    cloth: string;
    parts: number;
    totalWithMultiplier: string;
    buttons: number;
  } | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('app-language', lang);
  }, [lang]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstallPrompt(null);
    }
  };

  const calculate = () => {
    const w = parseFloat(width);
    const s = parseFloat(side);
    const m = parseFloat(multiplier);
    const texts = translations[lang];

    if (isNaN(s) || s <= 0) {
      alert(texts.alert);
      return;
    }

    const buttonsPerMeter = 21 * s;
    const btns = isDoublePart 
      ? Math.ceil((buttonsPerMeter / 2) / 2) * 2 
      : Math.ceil(buttonsPerMeter / 2) * 2;

    if (isNoJoin) {
      setResults({
        cloth: '0.00',
        parts: 0,
        totalWithMultiplier: (s * 3.10).toFixed(2),
        buttons: btns
      });
      return;
    }

    if (isNaN(w) || w <= 0 || isNaN(m) || m <= 0) {
      alert(texts.alert);
      return;
    }

    const clothForSide = s * 3;
    const partsCount = Math.ceil(clothForSide / w);
    const totalCloth = partsCount * w;
    
    // Total Measurement = (Parts * Multiplier) + (Parts * 7cm if not No Join)
    const addition = isNoJoin ? 0 : (partsCount * 0.07);
    const totalWithMultiplier = (partsCount * m) + addition;

    setResults({
      cloth: totalCloth.toFixed(2),
      parts: partsCount,
      totalWithMultiplier: totalWithMultiplier.toFixed(2),
      buttons: btns
    });
  };

  const downloadImage = async () => {
    if (downloadRef.current === null) return;
    
    try {
      const dataUrl = await toPng(downloadRef.current, {
        cacheBust: true,
        backgroundColor: '#e0e5ec',
        style: {
          padding: '20px',
        }
      });
      const link = document.createElement('a');
      link.download = `wifi-calc-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const texts = translations[lang];

  const FabricVisualizer = ({ showHeader = false, minimalist = false }: { showHeader?: boolean; minimalist?: boolean }) => {
    const sValue = side || '0.00';
    const mValue = multiplier || '0.00';

    return (
      <div className={cn(
        "relative w-full aspect-square mx-auto flex flex-col items-center justify-center",
        !minimalist ? "max-w-[320px] p-6 text-slate-700" : "w-full p-0"
      )}>
        {showHeader && results && (
          <div className="absolute top-4 text-center w-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">TOTAL MEASUREMENT</p>
            <p className="text-4xl font-mono font-bold text-slate-800">
              {results.totalWithMultiplier} <span className="text-2xl font-sans">{texts.meters}</span>
            </p>
          </div>
        )}

        <div className="relative w-full h-full flex items-center justify-center translate-y-2">
          {/* Top Label - Closer in minimalist mode */}
          <div className={cn(
            "absolute left-0 right-0 text-center",
            minimalist ? "top-[12%]" : "top-0"
          )}>
            {!minimalist && (
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-tighter leading-tight">
                {texts.sideLength}
              </p>
            )}
            <p className={cn(
              "font-mono font-bold text-emerald-900",
              minimalist ? "text-3xl" : "text-xl"
            )}>{sValue}</p>
          </div>

          {/* The Shape */}
          <div className={cn(
            "flex items-center justify-center",
            minimalist ? "w-[85%] h-[85%]" : "w-4/5 h-4/5 mt-6"
          )}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl filter">
              <AnimatePresence mode="wait">
                {!isDoublePart ? (
                  <motion.polygon
                    key="single"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    points="10,20 90,20 90,95 75,95 10,40"
                    fill="#1c5d22"
                  />
                ) : (
                  <motion.polygon
                    key="double"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    points="10,20 90,20 90,95 82,95 50,40 18,95 10,95"
                    fill="#1c5d22"
                  />
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* Right Side Label - Closer in minimalist mode */}
          <div className={cn(
            "absolute rotate-90 origin-center whitespace-nowrap",
            minimalist ? "right-[15%] translate-x-1/2" : "right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 translate-x-24 -mr-12"
          )}>
            {!minimalist && (
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest inline-block mr-2">
                {texts.multiplier}
              </p>
            )}
            <span className={cn(
              "font-mono font-bold text-emerald-900",
              minimalist ? "text-3xl" : "text-lg"
            )}>
              {mValue}
            </span>
          </div>
        </div>

        {/* Bottom Label / Hardware Count */}
        <div className={cn(
          "text-center mt-auto",
          minimalist ? "pb-[10%]" : "mt-6"
        )}>
          {!minimalist ? (
            <p className="text-xl font-bold text-slate-800">
              {isDoublePart ? texts.doublePart : texts.singlePart}
            </p>
          ) : results && (
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hardware Est.</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-mono font-bold text-slate-800">
                  {results.buttons} <span className="text-sm font-sans uppercase">qty</span>
                </p>
                <p className="text-sm font-bold text-slate-500">
                  ({Math.floor(results.buttons / 2)} {texts.pairs})
                </p>
              </div>
              <p className="text-xs font-bold text-primary mt-1">{isDoublePart ? texts.doublePart : texts.singlePart}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 md:p-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex flex-col gap-10 relative pt-12 sm:pt-0"
      >
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-bg-neumorphic shadow-outer flex items-center justify-center">
              <Calculator className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">{texts.title}</h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Fabric Measurement Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex px-6 py-2 rounded-full surface-inset text-sm font-medium text-primary">
              v2.8.0 • Standalone Mode
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-12 h-12 rounded-xl surface-card text-slate-700 flex items-center justify-center transition-all hover:bg-black/5 active:scale-95"
                title={texts.more}
              >
                <MoreVertical size={24} className="text-primary" />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLangMenuOpen(false);
                      }}
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-[280px] bg-bg-neumorphic rounded-[32px] shadow-2xl py-4 overflow-hidden border border-white/20"
                    >
                      {/* Main Menu Items */}
                      {!isLangMenuOpen ? (
                        <div className="flex flex-col">
                          <button
                            onClick={() => setIsLangMenuOpen(true)}
                            className="w-full text-left px-6 py-5 hover:bg-black/5 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl surface-inset flex items-center justify-center">
                                <Languages size={20} className="text-primary" />
                              </div>
                              <span className="text-sm font-bold uppercase tracking-wider text-slate-600">{texts.changeLang}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-primary uppercase">{lang}</span>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>

                          <a
                            href="https://zunaidhosse.github.io/My-contact/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left px-6 py-5 hover:bg-black/5 transition-colors flex items-center gap-4 border-t border-slate-200"
                          >
                            <div className="w-10 h-10 rounded-xl surface-inset flex items-center justify-center">
                              <ExternalLink size={20} className="text-primary" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">{texts.helpline}</span>
                          </a>

                          <button
                            onClick={() => {
                              setShowShareModal(true);
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-6 py-5 hover:bg-black/5 transition-colors flex items-center gap-4 border-t border-slate-200"
                          >
                            <div className="w-10 h-10 rounded-xl surface-inset flex items-center justify-center">
                              <Share2 size={20} className="text-primary" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">{texts.share}</span>
                          </button>
                        </div>
                      ) : (
                        /* Language Selection Submenu */
                        <div className="flex flex-col">
                          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{texts.changeLang}</h4>
                            <button 
                              onClick={() => setIsLangMenuOpen(false)}
                              className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                            >
                              <ChevronRight size={14} className="rotate-180" />
                              Back
                            </button>
                          </div>
                          {(Object.keys(translations) as Language[]).map((l) => (
                            <button
                              key={l}
                              onClick={() => {
                                setLang(l);
                                setIsLangMenuOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-8 py-5 hover:bg-black/5 transition-colors text-sm font-bold uppercase tracking-widest",
                                lang === l ? "text-primary bg-primary/5" : "text-slate-500"
                              )}
                            >
                              {l === 'en' ? 'English' : l === 'bn' ? 'বাংলা' : 'عربي'}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowShareModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm surface-card p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
              >
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="w-16 h-16 rounded-2xl bg-bg-neumorphic shadow-outer flex items-center justify-center mb-6">
                  <Share2 className="text-primary w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-2">{texts.share}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Scan to open other apps</p>
                
                <div className="p-6 bg-white rounded-3xl shadow-inset-sm mb-8">
                  <QRCodeSVG 
                    value="https://wifi-calculator.vercel.app/" 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter max-w-[200px]">
                  wifi-calculator.vercel.app
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Interface */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Controls */}
          <section className="lg:col-span-5 flex flex-col gap-8">
            <div className="p-8 surface-card">
              <div className="flex items-center justify-between mb-6 border-b border-slate-300 pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Surface Dimensions</h2>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none" htmlFor="no-join-toggle">
                    {texts.noJoin}
                  </label>
                  <div 
                    onClick={() => setIsNoJoin(!isNoJoin)}
                    className={cn(
                      "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors flex items-center",
                      isNoJoin ? "bg-primary" : "bg-slate-300 shadow-inset-sm"
                    )}
                  >
                    <motion.div 
                      animate={{ x: isNoJoin ? 20 : 0 }}
                      className="w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {!isNoJoin && (
                    <motion.div
                      key="width-input"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="label-caps">{texts.width} (mm)</label>
                      <input 
                        type="number" 
                        value={width} 
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl surface-inset text-lg font-mono text-primary outline-none"
                        step="0.01"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="label-caps">{texts.sideLength} (m)</label>
                  <input 
                    type="number" 
                    value={side} 
                    onChange={(e) => setSide(e.target.value)}
                    placeholder={texts.enterSide}
                    className="w-full h-12 px-4 rounded-xl surface-inset text-lg font-mono text-slate-600 placeholder:text-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="label-caps">{texts.multiplier}</label>
                  <input 
                    type="number" 
                    value={multiplier} 
                    onChange={(e) => setMultiplier(e.target.value)}
                    placeholder={texts.enterMultiplier}
                    className="w-full h-12 px-4 rounded-xl surface-inset text-lg font-mono text-slate-600 placeholder:text-slate-300 outline-none"
                  />
                </div>

                <div className="flex items-center justify-center gap-6 py-2">
                  <button 
                    onClick={() => setIsDoublePart(false)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      !isDoublePart ? "surface-inset text-primary" : "surface-card text-slate-400"
                    )}
                  >
                    {texts.singlePart}
                  </button>
                  <button 
                    onClick={() => setIsDoublePart(true)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      isDoublePart ? "surface-inset text-primary" : "surface-card text-slate-400"
                    )}
                  >
                    {texts.doublePart}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={calculate} className="btn-primary">
              {texts.calculate}
            </button>
            
            {installPrompt && (
              <button onClick={handleInstall} className="w-full py-3 rounded-xl surface-card text-[10px] font-bold uppercase tracking-widest text-slate-600 flex items-center justify-center gap-2">
                <Smartphone size={14} className="text-primary" />
                {texts.install}
              </button>
            )}
          </section>

          {/* Results Display */}
          <section className="lg:col-span-7">
            <div className="h-full p-8 md:p-10 surface-card shadow-outer-lg flex flex-col">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-8 text-slate-500 border-b border-slate-300 pb-2">Calculation Summary</h2>
              
              <div className="flex-grow flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {!isNoJoin && (
                    <motion.div 
                      key={results?.cloth}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col justify-center p-6 surface-inset-sm min-h-[120px]"
                    >
                      <span className="label-caps">{texts.meters} Required</span>
                      <span className="text-4xl font-light text-slate-800">
                        <strong className="font-bold">{results?.cloth || '0.00'}</strong> <small className="text-xl">m</small>
                      </span>
                      {results && (
                        <span className="text-lg font-bold text-slate-500 uppercase mt-2">🅿️ {results.parts} {texts.part}</span>
                      )}
                    </motion.div>
                  )}
                  
                  <motion.div 
                    key={results?.buttons}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex flex-col justify-center p-6 surface-inset-sm min-h-[120px]",
                      isNoJoin && "col-span-full"
                    )}
                  >
                    <span className="label-caps">Hardware Est.</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-light text-slate-800">
                        <strong className="font-bold">{results?.buttons || '0'}</strong> <small className="text-xl">qty</small>
                      </span>
                      {results && (
                        <span className="text-lg font-bold text-slate-500">
                          ({Math.floor(results.buttons / 2)} {texts.pairs})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">{isDoublePart ? texts.doublePart : texts.singlePart}</span>
                  </motion.div>
                </div>
                
                <div className="flex-grow p-4 md:p-8 rounded-3xl border-2 border-dashed border-slate-300">
                  <div className="flex flex-col md:flex-row justify-between items-center h-full gap-8">
                    <div className="space-y-6 text-center md:text-left w-full md:w-1/3">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Measurement</span>
                        <span className="text-2xl font-mono text-slate-700">{results?.totalWithMultiplier || '0.00'} {texts.meters}</span>
                      </div>

                      <div className="hidden md:block pt-4">
                        <QRCodeSVG 
                          value="https://wifi-calculator.vercel.app/" 
                          size={60}
                          level="M"
                          includeMargin={false}
                          className="opacity-50"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-grow flex items-center justify-center p-2">
                       <FabricVisualizer />
                    </div>
                  </div>
                </div>
              </div>

              <footer className="mt-8 pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Designer Credit</p>
                    <p className="text-xs font-bold text-slate-600">{texts.designer}</p>
                  </div>
                  <button 
                    onClick={downloadImage}
                    className={cn(
                      "flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-outer-sm transition-all hover:brightness-110 active:scale-95",
                      !results && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!results}
                  >
                    <Download size={16} />
                    {texts.download}
                  </button>
                </div>
                <div className="text-center sm:text-right">
                  <div className="flex justify-center sm:justify-end gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full surface-card flex items-center justify-center text-slate-500">
                       <Smartphone size={14} />
                     </div>
                     <div className="w-8 h-8 rounded-full surface-inset text-primary flex items-center justify-center">
                       <CheckCircle2 size={14} />
                     </div>
                  </div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Signal Loss Calibrated</p>
                </div>
              </footer>
            </div>
          </section>
        </main>

        {/* Global Footer - Interactive Buttons */}
        <footer className="border-t border-slate-200 pt-6 flex flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-2xl mx-auto">
          <a
            href="https://zunaidhosse.github.io/My-contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-8 sm:py-4 rounded-2xl surface-card text-slate-700 hover:text-primary transition-all active:scale-[0.98] font-bold tracking-wider text-xs sm:text-sm shadow-outer border border-white/20 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="truncate">{texts.helpline}</span>
          </a>

          <a
            href="https://sites.google.com/view/furniture-saudi/%E0%A6%B9%E0%A6%AE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-8 sm:py-4 rounded-2xl surface-card text-slate-700 hover:text-primary transition-all active:scale-[0.98] font-bold tracking-wider text-xs sm:text-sm shadow-outer border border-white/20 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="truncate">{texts.onlineShop}</span>
          </a>
        </footer>

        {/* Hidden area for image capture */}
        {results && (
          <div className="fixed -left-[2000px] top-0 pointer-events-none">
            <div 
              ref={downloadRef}
              className="w-[500px] aspect-[1/1] bg-[#e0e5ec] p-8 flex items-center justify-center border-[6px] border-double border-slate-300 rounded-[50px] shadow-outer relative overflow-hidden" 
            >
              {/* Decorative Corner Marks */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg"></div>

              {/* Watermark Seal */}
              <div className="absolute top-10 right-10 rotate-12 opacity-10">
                <div className="w-20 h-20 border-4 border-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-center p-2 uppercase">
                  Quality Guaranteed
                </div>
              </div>

              <div className="w-full h-full flex flex-col items-center justify-center">
                <FabricVisualizer showHeader={false} minimalist={true} />
              </div>
              
              <div className="absolute bottom-4 text-center w-full">
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400 opacity-50">
                  {texts.designer} | Precision Fabric Tools
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
