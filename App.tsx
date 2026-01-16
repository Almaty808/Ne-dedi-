import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  History, 
  Copy, 
  Check, 
  RefreshCw, 
  Quote, 
  Info,
  ChevronRight,
  Heart,
  MessageCircle,
  Code2,
  Zap,
  Search
} from 'lucide-react';
import { TranslationMode, HistoryItem, TranslationResult, AppLanguage } from './types';
import { getTranslation } from './services/geminiService';

const Logo = () => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="relative w-64 h-64 mb-8 select-none logo-sticker flex flex-col items-center justify-center"
  >
    {/* Main Speech Bubble Wrapper */}
    <div className="relative w-48 h-40 bg-white border-[4px] border-slate-900 rounded-[3rem] shadow-sm flex items-center justify-center mb-1">
      {/* The Bubble Tail */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-r-[4px] border-b-[4px] border-slate-900 rotate-45 z-0" />
      
      {/* Decorative Kazakh Ornament (Central) */}
      <div className="z-10 relative flex items-center justify-center w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Simplified Ornament based on logo */}
          <path d="M50 10 Q65 10 65 25 Q65 40 50 50 Q35 40 35 25 Q35 10 50 10" fill="#0fb4ba" />
          <path d="M50 90 Q35 90 35 75 Q35 60 50 50 Q65 60 65 75 Q65 90 50 90" fill="#fbc02d" />
          <path d="M10 50 Q10 35 25 35 Q40 35 50 50 Q40 65 25 65 Q10 65 10 50" fill="#1a237e" />
          <path d="M90 50 Q90 65 75 65 Q60 65 50 50 Q60 35 75 35 Q90 35 90 50" fill="#0fb4ba" />
          <rect x="44" y="44" width="12" height="12" fill="#1a237e" transform="rotate(45 50 50)" />
          {/* Decorative accents */}
          <circle cx="50" cy="50" r="4" fill="#fbc02d" />
        </svg>
      </div>
    </div>

    {/* Pialas and Code Group */}
    <div className="flex items-end justify-center gap-2 mt-2">
      {/* Left Piala (Teal) */}
      <motion.div 
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative w-16 h-12 bg-white border-[3px] border-slate-900 rounded-b-3xl rounded-t-lg overflow-hidden piala-shadow"
      >
        <div className="absolute inset-0 bg-[#0fb4ba]" />
        <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-current">
             <path d="M50 20 L80 50 L50 80 L20 50 Z" />
           </svg>
        </div>
      </motion.div>

      {/* Code Symbol */}
      <div className="flex flex-col items-center mb-1">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-[#7c4dff]/10 p-1.5 rounded-lg"
        >
          <Code2 className="w-6 h-6 text-[#7c4dff]" strokeWidth={3} />
        </motion.div>
      </div>

      {/* Right Piala (Navy) */}
      <motion.div 
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1.5 }}
        className="relative w-16 h-12 bg-white border-[3px] border-slate-900 rounded-b-3xl rounded-t-lg overflow-hidden piala-shadow"
      >
        <div className="absolute inset-0 bg-[#1a237e]" />
        <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-current">
             <path d="M50 20 L80 50 L50 80 L20 50 Z" />
           </svg>
        </div>
      </motion.div>
    </div>

    {/* Text Logo */}
    <div className="mt-2 flex flex-col items-center">
      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl font-black text-[#1a237e] tracking-tighter">Ne Dedi?</span>
        <span className="text-sm font-bold text-slate-400">.kz</span>
      </div>
    </div>
  </motion.div>
);

const UI_TEXT = {
  ru: {
    title: "Ne Dedi?!",
    subtitle: "Умный переводчик с женского на мужской и наоборот",
    venus: "Она",
    mars: "Он",
    placeholder_her: "Что она сказала...",
    placeholder_him: "Что он сказал...",
    recent: "Последние озарения",
    footer: "Создано для взаимопонимания, Ne Dedi.kz",
    error: "Ошибка связи с оракулом.",
    what_said: "Исходная фраза",
    real_meaning: "Скрытый смысл",
    expert_tip: "Совет эксперта",
    copy: "Копировать",
    copied: "Скопировано!",
    decode: "Расшифровать",
    items_label: "ЗАПИСЕЙ"
  },
  kk: {
    title: "Ne Dedi?!",
    subtitle: "Ерлер мен әйелдер тілін түсінуге көмектесетін дешифратор",
    venus: "Ол (Әйел)",
    mars: "Ол (Ер)",
    placeholder_her: "Ол не деді...",
    placeholder_him: "Ол не деді...",
    recent: "Тарих",
    footer: "Махаббатпен жасалған, Ne Dedi.kz",
    error: "Байланыс үзілді.",
    what_said: "Айтылған сөз",
    real_meaning: "Шындығында",
    expert_tip: "Маман кеңесі",
    copy: "Көшіру",
    copied: "Көшірілді!",
    decode: "Мағынасын ашу",
    items_label: "ЖАЗБА"
  },
  en: {
    title: "Ne Dedi?!",
    subtitle: "The ultimate gender meaning decoder",
    venus: "She",
    mars: "He",
    placeholder_her: "What she said...",
    placeholder_him: "What he said...",
    recent: "Recent Insights",
    footer: "Bridging the gap with humor, Ne Dedi.kz",
    error: "Oracle is currently resting.",
    what_said: "Original Phrase",
    real_meaning: "Hidden Meaning",
    expert_tip: "Pro Tip",
    copy: "Copy Meaning",
    copied: "Copied!",
    decode: "Decode Message",
    items_label: "ITEMS"
  }
};

const PRESETS = {
  ru: {
    [TranslationMode.WOMEN_TO_MEN]: ["Я не обиделась.", "Делай что хочешь.", "Я толстая?", "Нам нужно поговорить."],
    [TranslationMode.MEN_TO_WOMEN]: ["Я скоро буду.", "Я забыл.", "Мне все равно, выбирай сама.", "Ничего страшного."]
  },
  kk: {
    [TranslationMode.WOMEN_TO_MEN]: ["Ренжіген жоқпын.", "Өзің біл.", "Мен толық көрінбеймін бе?", "Сөйлесуіміз керек."],
    [TranslationMode.MEN_TO_WOMEN]: ["Қазір барамын.", "Ұмытып кетіппін.", "Өзің таңда.", "Ештеңе болған жоқ."]
  },
  en: {
    [TranslationMode.WOMEN_TO_MEN]: ["I'm fine.", "Do whatever you want.", "Is it hot in here?", "We need to talk."],
    [TranslationMode.MEN_TO_WOMEN]: ["I'll do it later.", "I forgot.", "I don't care, you pick.", "It's nothing."]
  }
};

const LanguageToggle: React.FC<{ current: AppLanguage, set: (l: AppLanguage) => void }> = ({ current, set }) => (
  <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
    {(['ru', 'kk', 'en'] as AppLanguage[]).map((l) => (
      <button
        key={l}
        onClick={() => set(l)}
        className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-tight transition-all uppercase ${
          current === l ? 'bg-[#1a237e] text-white shadow-md scale-105' : 'text-slate-500 hover:bg-white/50'
        }`}
      >
        {l}
      </button>
    ))}
  </div>
);

export default function App() {
  const [lang, setLang] = useState<AppLanguage>('ru');
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.WOMEN_TO_MEN);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = UI_TEXT[lang];
  const isWomen = mode === TranslationMode.WOMEN_TO_MEN;

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const translation = await getTranslation(inputText, mode, lang);
      setResult(translation);
      const newItem: HistoryItem = {
        ...translation,
        id: crypto.randomUUID(),
        mode,
        language: lang,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (error) {
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `"${result.literalText}" -> ${result.decodedMeaning}\nTip: ${result.relationshipTip}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearInput = () => {
    setInputText('');
    setResult(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1a237e] flex items-center justify-center shadow-lg">
            <Zap className="text-[#fbc02d] w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black text-[#1a237e] tracking-tighter">Ne Dedi?!</h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <LanguageToggle current={lang} set={setLang} />
        </motion.div>
      </header>

      {/* Hero */}
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 font-bold max-w-sm leading-tight text-lg"
        >
          {t.subtitle}
        </motion.p>
      </div>

      {/* Main Content */}
      <main className="w-full space-y-6">
        {/* Mode Toggles */}
        <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-slate-200 shadow-sm max-w-[340px] mx-auto overflow-hidden">
          <button 
            onClick={() => setMode(TranslationMode.WOMEN_TO_MEN)}
            className={`flex-1 py-3 px-6 rounded-[2.2rem] text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
              isWomen ? 'bg-[#0fb4ba] text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWomen ? 'fill-white' : ''}`} />
            {t.venus}
          </button>
          <button 
            onClick={() => setMode(TranslationMode.MEN_TO_WOMEN)}
            className={`flex-1 py-3 px-6 rounded-[2.2rem] text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
              !isWomen ? 'bg-[#1a237e] text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${!isWomen ? 'fill-white' : ''}`} />
            {t.mars}
          </button>
        </div>

        {/* Decoder Input Card */}
        <motion.div 
          layout
          className="glass-card rounded-[3rem] shadow-2xl overflow-hidden relative"
        >
          {loading && <div className="scanner-line z-20" style={{background: 'linear-gradient(90deg, transparent, #0fb4ba, transparent)', boxShadow: '0 0 15px #0fb4ba'}} />}
          
          <div className="p-6 md:p-10 space-y-8">
            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isWomen ? t.placeholder_her : t.placeholder_him}
                className="w-full h-36 md:h-48 p-8 rounded-[2.5rem] bg-slate-50/50 border-2 border-transparent focus:border-[#0fb4ba]/20 focus:bg-white transition-all outline-none resize-none text-xl md:text-2xl text-slate-800 placeholder:text-slate-300 font-extrabold"
              />
              <div className="absolute top-6 right-6">
                {inputText && (
                  <button 
                    onClick={clearInput}
                    className="p-3 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {PRESETS[lang][mode].map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => setInputText(phrase)}
                  className="px-5 py-2.5 rounded-2xl bg-white/50 border border-slate-100 hover:border-[#0fb4ba] hover:bg-[#0fb4ba]/5 text-xs text-slate-500 font-black uppercase transition-all"
                >
                  {phrase}
                </button>
              ))}
            </div>

            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xl uppercase flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                loading || !inputText.trim()
                ? 'bg-slate-100 text-slate-300'
                : 'bg-[#1a237e] text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <span>{t.decode}</span>
                  <Search className="w-6 h-6" />
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100 bg-[#f0fdfa]/30 overflow-hidden"
              >
                <div className="p-8 md:p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isWomen ? 'bg-[#0fb4ba]/10 text-[#0fb4ba]' : 'bg-[#1a237e]/10 text-[#1a237e]'}`}>
                      <Info className="w-4 h-4" />
                      {result.vibe}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#1a237e] uppercase transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.what_said}</h4>
                      <p className="text-2xl md:text-3xl font-black text-slate-800 italic leading-snug">
                        "{result.literalText}"
                      </p>
                    </div>

                    <div className="relative p-8 rounded-[3rem] bg-white shadow-sm border border-slate-100 overflow-hidden">
                      <div className={`absolute top-0 left-0 bottom-0 w-3 ${isWomen ? 'bg-[#0fb4ba]' : 'bg-[#1a237e]'}`} />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.real_meaning}</h4>
                      <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-black">
                        {result.decodedMeaning}
                      </p>
                    </div>

                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="bg-[#1a237e] rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#0fb4ba]/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-[#fbc02d] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {t.expert_tip}
                        </h4>
                        <p className="text-lg md:text-xl font-bold leading-relaxed italic">
                          "{result.relationshipTip}"
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full space-y-4 pt-8">
            <div className="flex items-center justify-between px-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <History className="w-5 h-5 text-[#0fb4ba]" />
                {t.recent}
              </h3>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl uppercase">
                {history.length} {t.items_label}
              </span>
            </div>

            <div className="grid gap-4">
              {history.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/50 hover:bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all flex items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => {
                    setInputText(item.literalText);
                    setResult(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                        item.mode === TranslationMode.WOMEN_TO_MEN ? 'bg-[#0fb4ba]/10 text-[#0fb4ba]' : 'bg-[#1a237e]/10 text-[#1a237e]'
                      }`}>
                        {item.mode === TranslationMode.WOMEN_TO_MEN ? '♀' : '♂'} {item.language}
                      </span>
                    </div>
                    <p className="text-slate-800 font-extrabold truncate text-lg">"{item.literalText}"</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[#0fb4ba] transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <footer className="pt-12 pb-8 text-center">
          <div className="inline-flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm">
                <Heart className="w-4 h-4 text-[#0fb4ba] fill-current" />
                <span className="text-[11px] font-black text-[#1a237e] uppercase tracking-widest">{t.footer}</span>
             </div>
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
               © 2025 NE DEDI?! • ALL RIGHTS RESERVED
             </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
