import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Heart, 
  Sparkles, 
  Check, 
  Search, 
  X,
  Star,
  Compass,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burgers' | 'pizzas' | 'sides' | 'drinks';
  image: string;
  tags: string[];
  isSpicy?: boolean;
  isPopular?: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
  selectedToppings?: string[];
  finalPrice: number;
}

// --- Mock Data (Hebrew) ---
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'קראנץ׳ בורגר שחור פרימיום',
    description: '220 גרם בקר משובח בלחמניית פחם שחורה, איולי כמהין, ריבת בצל ביתית, ארוגולה טרייה ופרוסות קורנישון.',
    price: 68,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    tags: ['לחמנייה שחורה', 'בקר פרימיום'],
    isPopular: true
  },
  {
    id: 'b2',
    name: 'סמאש בורגר דאבל צ׳יז',
    description: 'קציצה כפולה (110 גרם כל אחת) מבקר מובחר, גבינת צ׳דר נמסה (טבעונית/חלבית לבחירה), בצל סגול קצוץ ורוטב סמאש סודי.',
    price: 62,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    tags: ['דאבל קציצה', 'הכי נמכר'],
    isPopular: true
  },
  {
    id: 'b3',
    name: 'רוסטד אל פדרו',
    description: '220 גרם בקר עסיסי, פלפלים קלויים, פנצ׳טה טלה פריכה, רוטב צ׳יפוטלה מעושן ובצל ירוק.',
    price: 72,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    tags: ['פיקנטי', 'מעושן'],
    isSpicy: true
  },
  {
    id: 'p1',
    name: 'פיצה נאפוליטנה בלו ניאון',
    description: 'רוטב עגבניות תמר איטלקיות, מוצרלה פרש, נגיעות גבינה כחולה משובחת, בזיליקום ושמן זית כתית מעולה.',
    price: 58,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['טאבון אבן', 'גבינה כחולה'],
    isPopular: true
  },
  {
    id: 'p2',
    name: 'פיצה קרנבל בשרים',
    description: 'בסיס רוטב עגבניות עשיר, מוצרלה, פפרוני בקר פריך, קבב מפורק, בצל סגול מקורמל ורוטב ברבקיו.',
    price: 68,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    tags: ['קרנבל בשרים', 'מושחתת']
  },
  {
    id: 'p3',
    name: 'פיצה כמהין ופטריות יער',
    description: 'רוטב שמנת כמהין עשיר, תערובת פטריות פורטבלו ושמפיניון צלויות, שום קונפי, ארוגולה ופרמז׳ן מגורר.',
    price: 64,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    tags: ['צמחוני', 'ספיישל כמהין']
  },
  {
    id: 's1',
    name: 'צ׳יפס הבית קריספי תבלינים',
    description: 'תפוחי אדמה פריכים במיוחד בתיבול פפריקה מעושנת, שום, שמיר ומלח ים אטלנטי.',
    price: 24,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    tags: ['טבעוני', 'מבוקש ביותר']
  },
  {
    id: 's2',
    name: 'טבעות בצל בבירה שחורה',
    description: 'טבעות בצל ענקיות בציפוי בלילת בירה שחורה פריכה, מוגש עם מטבל איולי שום שמיר.',
    price: 26,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80',
    tags: ['תוספת פריכה']
  },
  {
    id: 'd1',
    name: 'מילקשייק לוטוס כחול',
    description: 'גלידת וניל צרפתית שמנת, ממרח לוטוס משובח, שברי עוגיות, קצפת עשירה וסירופ כורכום/פיטאיה כחול חגיגי.',
    price: 28,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    tags: ['קינוח משגע', 'ספיישל כחול'],
    isPopular: true
  },
  {
    id: 'd2',
    name: 'בירה מהחבית - כחול מקומי',
    description: 'בירה קראפט בהירה, צוננת ומלאת ארומה, מבושלת במיוחד עבור המבורגר ופיצה.',
    price: 22,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=600&q=80',
    tags: ['אלכוהול', 'צונן']
  }
];

const REVIEWS = [
  {
    name: 'רון כהן',
    stars: 5,
    comment: 'המבורגר הפחם השחור היה חוויה של פעם בחיים! והגבינה הכחולה על הפיצה... פשוט שילוב קטלני של טעמים. עיצוב המקום מרשים והמשלוח הגיע חם ומהיר.',
    date: 'לפני יומיים'
  },
  {
    name: 'מיכל לוי',
    stars: 5,
    comment: 'הפיצה הדקה הכי טובה שאכלתי בארץ! הבצק קריספי בדיוק במידה הנכונה, רוטב העגבניות מושלם והשירות שלהם בטלפון פשוט מקסים.',
    date: 'לפני שבוע'
  },
  {
    name: 'יונתן מזרחי',
    stars: 5,
    comment: 'מזמין מכאן לפחות פעמיים בשבוע. המילקשייק כחול לוטוס הוא קינוח חובה אחרי הסמאש בורגר הכפול. מומלץ בחום רב!',
    date: 'לפני שבועיים'
  }
];

const TOPPINGS_LIST = [
  { name: 'גבינת צ׳דר נמסה', price: 6 },
  { name: 'בצל מקורמל', price: 4 },
  { name: 'פטריות יער כמהין', price: 8 },
  { name: 'ביצת עין פריכה', price: 6 },
  { name: 'פפרוני בקר', price: 9 },
  { name: 'אננס מקורמל', price: 7 },
  { name: 'זיתי קלמטה', price: 5 },
  { name: 'פלפל חלפניו חריף', price: 4 }
];

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState<'all' | 'burgers' | 'pizzas' | 'sides' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDiyOpen, setIsDiyOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'form' | 'success'>('idle');
  
  // DIY Maker State
  const [diyBase, setDiyBase] = useState<'burger' | 'pizza'>('burger');
  const [diyToppings, setDiyToppings] = useState<string[]>([]);
  const [diyNotes, setDiyNotes] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('credit');

  // Filter Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = item.name.includes(searchQuery) || item.description.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Calculate Cart Subtotal
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
  }, [cart]);

  const deliveryFee = cart.length > 0 ? 15 : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  // Cart Handlers
  const addToCart = (item: MenuItem, toppings: string[] = [], customNotes = '') => {
    const extraPrice = toppings.reduce((acc, topName) => {
      const found = TOPPINGS_LIST.find(t => t.name === topName);
      return acc + (found ? found.price : 0);
    }, 0);

    const finalPrice = item.price + extraPrice;

    // Check if item already exists with exact same custom notes & toppings
    const existingIndex = cart.findIndex(cartItem => 
      cartItem.menuItem.id === item.id && 
      JSON.stringify(cartItem.selectedToppings) === JSON.stringify(toppings) &&
      cartItem.customization === customNotes
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem: item, quantity: 1, selectedToppings: toppings, customization: customNotes, finalPrice }]);
    }

    // Trigger feedback / open cart slightly
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // DIY custom creator item compiler
  const handleAddDiyToCart = () => {
    const baseItem: MenuItem = diyBase === 'burger' 
      ? {
          id: 'diy-burger',
          name: 'המבורגר Custom משלכם',
          description: `הרכבה אישית פסיכודלית. בסיס המבורגר מובחר עם: ${diyToppings.join(', ') || 'ללא תוספות'}`,
          price: 50,
          category: 'burgers',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          tags: ['הרכבה עצמית', 'ספיישל ניאון']
        }
      : {
          id: 'diy-pizza',
          name: 'פיצה קאסטם בעיצוב אישי',
          description: `בצק נפוליטני, מוצרלה ורוטב עשיר עם: ${diyToppings.join(', ') || 'ללא תוספות'}`,
          price: 45,
          category: 'pizzas',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
          tags: ['הרכבה עצמית', 'מהטאבון']
        };

    addToCart(baseItem, diyToppings, diyNotes);
    setIsDiyOpen(false);
    // Reset DIY state
    setDiyToppings([]);
    setDiyNotes('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('נא למלא את כל השדות החיוניים');
      return;
    }
    setCheckoutStep('success');
  };

  const resetAll = () => {
    setCart([]);
    setCheckoutStep('idle');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setIsCartOpen(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-blue-950/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-cyan-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-blue-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <span className="text-2xl">🍔</span>
              <div className="absolute -top-1 -right-1 text-xs">🍕</div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-blue-400 via-cyan-300 to-white">
                קראנץ׳ & סלייס
              </h1>
              <p className="text-[10px] text-blue-400 tracking-widest font-semibold uppercase">המבורגר ופיצה פרימיום</p>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-blue-900/30">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>30-40 דק׳ הגעה</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-blue-900/30">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>משלוחים בגוש דן</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-blue-900/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>המטבח פתוח</span>
            </div>
          </div>

          {/* Cart & Contact Action */}
          <div className="flex items-center gap-3">
            <a href="tel:*8080" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-blue-400 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-bold text-sm">*8080</span>
            </a>

            {/* Custom DIY Builder Trigger */}
            <button
              onClick={() => setIsDiyOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-l from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
              <span>הרכיבו בעצמכם</span>
            </button>

            {/* Cart Trigger Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-blue-950 hover:border-blue-500/40 text-slate-100 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-8 pb-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text & Content Column */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>דיל החודש: פיצה משפחתית + 2 המבורגרים ב-149 ₪ בלבד!</span>
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                המבורגר מושחת שחור <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-400 via-cyan-400 to-indigo-300">
                  ופיצה נפוליטנית מטריפה
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
                השילוב הקדוש בין קציצות בקר שמנמנות בלחמניות פחם שחורות פריכות לבין פיצות מטאבון אבן לוהט, עם גבינת מוצרלה נמתחת ואיולי כמהין שאי אפשר להפסיק ללקק. מוזמנים לחוות את הטירוף הכחול אצלכם בבית.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a 
                  href="#menu" 
                  className="bg-blue-600 hover:bg-blue-500 text-white text-base font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/45 transform hover:-translate-y-1"
                >
                  לתפריט המלא והמזיל ריר
                </a>
                <button 
                  onClick={() => setIsDiyOpen(true)}
                  className="bg-slate-900/80 hover:bg-slate-800 text-slate-100 hover:text-white border border-blue-900/60 hover:border-blue-400 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300"
                >
                  הרכבת המבורגר/פיצה אישית
                </button>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-900 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-right">
                  <h4 className="text-2xl font-extrabold text-blue-400">100%</h4>
                  <p className="text-xs text-slate-400">בקר פרימיום טרי</p>
                </div>
                <div className="text-center lg:text-right">
                  <h4 className="text-2xl font-extrabold text-cyan-400">450°</h4>
                  <p className="text-xs text-slate-400">חום טאבון אבן איטלקי</p>
                </div>
                <div className="text-center lg:text-right">
                  <h4 className="text-2xl font-extrabold text-indigo-400">סופר</h4>
                  <p className="text-xs text-slate-400">מהיר ולוהט אליכם</p>
                </div>
              </div>

            </div>

            {/* Visual Hero Art Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                
                {/* Neon circle backdrop effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-900/40 animate-spin-slow border-2 border-dashed border-blue-500/30" />
                
                {/* Floating main burger image */}
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" 
                  alt="המבורגר הדגל" 
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-slate-900 hover:scale-105 transition-transform duration-500"
                />

                {/* Floating pizza mini-card */}
                <div className="absolute -bottom-6 -left-6 bg-slate-950/95 p-3 rounded-2xl border border-blue-500/40 shadow-xl flex items-center gap-3 animate-bounce">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80" 
                    alt="פיצה" 
                    className="w-12 h-12 rounded-lg object-cover" 
                  />
                  <div>
                    <p className="text-xs font-bold text-white">פיצה בלוגלוו</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">🔥 מבוקשת מאוד</p>
                  </div>
                </div>

                {/* Hot item tag */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                  ספיישלים חמים! ⚡
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- MENU / CATEGORIES SECTION --- */}
      <section id="menu" className="py-16 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold text-white">התפריט המטורף שלנו</h3>
            <p className="text-slate-400 text-sm mt-2">
              בחרו את השילוב המושלם שלכם. המבורגרים נוטפי צ׳דר, פיצות נפוליטניות אותנטיות, תוספות משלימות ומשקאות צוננים.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="חפשו מנה אהובה... (למשל: סמאש, פטריות, צ׳יפס)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-100 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: 'all', label: 'כל התפריט 🍽️' },
              { id: 'burgers', label: 'המבורגרים פרימיום 🍔' },
              { id: 'pizzas', label: 'פיצות מהטאבון 🍕' },
              { id: 'sides', label: 'תוספות קראנצ׳יות 🍟' },
              { id: 'drinks', label: 'שתייה ומתוקים 🥤' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-blue-950/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-850 hover:border-blue-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                >
                  {/* Food Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-end">
                      {item.isPopular && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase">
                          מבוקש ביותר 🔥
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
                          פיקנטי 🌶️
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 text-2xl font-black text-white bg-blue-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-blue-500/20">
                      ₪{item.price}
                    </div>
                  </div>

                  {/* Food Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Quick Topping / Customize triggers */}
                    <div className="pt-4 mt-4 border-t border-slate-950/60 flex items-center justify-between gap-2">
                      <button 
                        onClick={() => {
                          // Quick add toppings or just add directly
                          addToCart(item);
                        }}
                        className="flex-1 bg-slate-950 hover:bg-blue-600 text-slate-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-blue-900/30 hover:border-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                        <span>הוספה להזמנה</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-slate-400">לא מצאנו אף מנה התואמת את החיפוש שלכם...</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  אפסו את החיפוש
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* --- CUSTOM ORDER (DIY MAKER) SECTION / DRAWER --- */}
      {isDiyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-slate-900 border border-blue-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
          >
            {/* Header */}
            <div className="p-6 bg-slate-950 border-b border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                <div>
                  <h3 className="text-xl font-bold text-white">הרכיבו את יצירת המופת שלכם</h3>
                  <p className="text-xs text-slate-400">הבורגר או הפיצה המושלמים בטעם אישי</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDiyOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Step 1: Base Selection */}
              <div>
                <label className="block text-sm font-extrabold text-slate-300 mb-2">1. בחרו את הבסיס האלוהי</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDiyBase('burger')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      diyBase === 'burger' 
                        ? 'bg-blue-950/50 border-blue-500 text-white' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-3xl">🍔</span>
                    <span className="font-bold">בסיס בורגר פרימיום (50 ₪)</span>
                    <span className="text-[10px]">כולל לחמנייה, קציצה 220 גרם, חמוצים ורטבים קלאסיים</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiyBase('pizza')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      diyBase === 'pizza' 
                        ? 'bg-blue-950/50 border-blue-500 text-white' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-3xl">🍕</span>
                    <span className="font-bold">בסיס פיצה נפוליטנה (45 ₪)</span>
                    <span className="text-[10px]">בצק שחמר במשך 72 שעות, רוטב עגבניות איכותי ומוצרלה</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Toppings Selector */}
              <div>
                <label className="block text-sm font-extrabold text-slate-300 mb-2">2. הוסיפו שדרוגים מטורפים</label>
                <p className="text-xs text-slate-500 mb-3">ניתן לבחור מספר תוספות ללא הגבלה</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPPINGS_LIST.map(topping => {
                    const isSelected = diyToppings.includes(topping.name);
                    return (
                      <button
                        key={topping.name}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setDiyToppings(diyToppings.filter(t => t !== topping.name));
                          } else {
                            setDiyToppings([...diyToppings, topping.name]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold text-right flex justify-between items-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-400 text-blue-300' 
                            : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <span>{topping.name}</span>
                        <span className="text-blue-400">+₪{topping.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Special Notes */}
              <div>
                <label className="block text-sm font-extrabold text-slate-300 mb-2">3. בקשות מיוחדות למטבח</label>
                <textarea
                  placeholder="למשל: בורגר מדיום-וול, רוטב בצד, פיצה ללא אורגנו..."
                  value={diyNotes}
                  onChange={(e) => setDiyNotes(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 h-20"
                />
              </div>
            </div>

            {/* Footer Summary & Add */}
            <div className="p-6 bg-slate-950 border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400">מחיר משוער להרכבה שלכם:</span>
                <div className="text-2xl font-black text-white">
                  ₪{
                    (diyBase === 'burger' ? 50 : 45) + 
                    diyToppings.reduce((acc, tName) => {
                      const found = TOPPINGS_LIST.find(t => t.name === tName);
                      return acc + (found ? found.price : 0);
                    }, 0)
                  }
                </div>
              </div>

              <button
                onClick={handleAddDiyToCart}
                className="w-full sm:w-auto bg-gradient-to-l from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                הוסיפו את יצירת המופת לעגלה 🛒
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 left-0 max-w-full flex">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-slate-950 border-r border-blue-950 flex flex-col h-full shadow-2xl relative"
              >
                {/* Cart Header */}
                <div className="p-6 border-b border-blue-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">עגלת הקניות שלכם</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <span className="text-5xl block animate-bounce">🍕</span>
                      <p className="text-slate-400 text-sm">העגלה ריקה... זמן לפנק את הבטן!</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg text-xs transition-all"
                      >
                        מצאו משהו טעים
                      </button>
                    </div>
                  ) : (
                    cart.map((cartItem, index) => (
                      <div 
                        key={`${cartItem.menuItem.id}-${index}`} 
                        className="bg-slate-900 rounded-xl p-4 border border-blue-950/60 flex gap-3 relative"
                      >
                        <img 
                          src={cartItem.menuItem.image} 
                          alt={cartItem.menuItem.name} 
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{cartItem.menuItem.name}</h4>
                          <p className="text-xs text-blue-400 font-bold mt-1">₪{cartItem.finalPrice} ליחידה</p>
                          
                          {cartItem.selectedToppings && cartItem.selectedToppings.length > 0 && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                              + תוספות: {cartItem.selectedToppings.join(', ')}
                            </p>
                          )}

                          {cartItem.customization && (
                            <p className="text-[11px] text-indigo-300 italic mt-0.5 line-clamp-1">
                              📝 {cartItem.customization}
                            </p>
                          )}

                          {/* Item Actions */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                              <button 
                                onClick={() => updateQuantity(index, -1)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold px-1">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(index, 1)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeItem(index)}
                              className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-blue-950 bg-slate-950/90 space-y-4">
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between text-slate-400">
                        <span>סכום ביניים</span>
                        <span>₪{cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>דמי משלוח ספידי</span>
                        <span>₪{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-white font-extrabold text-base pt-2 border-t border-blue-950">
                        <span>סה״כ לתשלום</span>
                        <span className="text-blue-400">₪{cartTotal}</span>
                      </div>
                    </div>

                    {checkoutStep === 'idle' && (
                      <button 
                        onClick={() => setCheckoutStep('form')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                      >
                        <span>התקדמו למילוי פרטים ומשלוח</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Quick checkout fields if state is form */}
                    {checkoutStep === 'form' && (
                      <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2 border-t border-blue-900/30">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-bold">שם מלא</label>
                          <input 
                            type="text" 
                            required
                            placeholder="ישראל ישראלי" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-bold">טלפון ליצירת קשר</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="050-1234567" 
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-bold">כתובת למשלוח</label>
                          <input 
                            type="text" 
                            required
                            placeholder="רחוב, מספר בית, עיר" 
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Payment Selection */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('credit')}
                            className={`p-2 rounded-lg border text-xs font-bold text-center ${
                              paymentMethod === 'credit' ? 'border-blue-500 bg-blue-950/20 text-blue-300' : 'border-slate-800 text-slate-400'
                            }`}
                          >
                            💳 אשראי טלפוני / באתר
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-2 rounded-lg border text-xs font-bold text-center ${
                              paymentMethod === 'cash' ? 'border-blue-500 bg-blue-950/20 text-blue-300' : 'border-slate-800 text-slate-400'
                            }`}
                          >
                            💵 מזומן לשליח
                          </button>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setCheckoutStep('idle')}
                            className="w-1/3 bg-slate-900 hover:bg-slate-850 text-slate-400 py-3 px-4 rounded-xl text-xs font-bold"
                          >
                            חזרה לעגלה
                          </button>
                          <button 
                            type="submit"
                            className="w-2/3 bg-gradient-to-l from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20"
                          >
                            אישור והזמנה כעת 🚀
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Success Screen */}
                    {checkoutStep === 'success' && (
                      <div className="text-center py-6 space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white">ההזמנה בדרך לתנור!</h4>
                        <p className="text-xs text-slate-400">
                          תודה {customerName}, קלטנו את ההזמנה שלך על סך ₪{cartTotal}. השליח כבר מתחיל להניע את הקטנוע!
                        </p>
                        <button 
                          onClick={resetAll}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-xs"
                        >
                          מעולה, פתחו הזמנה חדשה
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REVIEWS SECTION --- */}
      <section className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">מילים נוטפות גבינה מהלקוחות שלנו</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">אל תאמינו רק לנו, תקשיבו לאנשים שכבר חוו את הטירוף הכחול.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <div 
                key={i}
                className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 hover:border-blue-900/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-blue-400 text-blue-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    ״{review.comment}״
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-950/60 pt-4">
                  <span className="font-bold text-xs text-white">{review.name}</span>
                  <span className="text-[10px] text-slate-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- PROMOTION SECTION (IMAGE BANNER & REASON TO BUY) --- */}
      <section className="py-16 bg-gradient-to-t from-slate-950 to-slate-900/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-tr from-slate-950 via-blue-950/40 to-slate-950 rounded-3xl border border-blue-500/20 p-8 sm:p-12 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              
              <div className="space-y-4 text-center lg:text-right">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  מועדון החברים שלנו 💎
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  הצטרפו למועדון הקראנץ׳ <br /> וקבלו 10% הנחה כבר בהזמנה הראשונה!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto lg:mx-0">
                  בכל קנייה אתם צוברים נקודות שמעניקות פיצות והמבורגרים בחינם, תוספות מתנה וגישה לספיישלים המטורפים שלנו לפני כולם.
                </p>

                {/* Micro Newsletter Form */}
                <div className="pt-2 max-w-sm mx-auto lg:mx-0">
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="הכניסו אימייל / טלפון..." 
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => alert('ברוכים הבאים למועדון! קוד ההנחה שלכם הוא: BLUECRUNCH')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-xl text-xs transition-colors"
                    >
                      הצטרפו כעת
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">אין ספאם, רק הטבות משמינות במיוחד.</p>
                </div>
              </div>

              {/* Promo graphic placeholder */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80" 
                    alt="צ׳יפס חם" 
                    className="w-36 h-36 object-cover rounded-2xl border border-blue-900/40"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=300&q=80" 
                    alt="מילקשייק כחול" 
                    className="w-36 h-36 object-cover rounded-2xl border border-blue-900/40 translate-y-4"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- CONTACT & INFO SECTION --- */}
      <section className="py-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-950 text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">הסניף הראשי שלנו</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              שדרות רוטשילד 42, תל אביב-יפו <br />
              (קרוב לכיכר הבימה)
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-950 text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">שעות פתיחה ומשלוחים</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ימים א׳ - ה׳: 11:00 בבוקר עד 02:00 בלילה <br />
              יום ו׳ ומוצ״ש: שעה לפני כניסת השבת ועד השעות הקטנות
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-950 text-blue-400">
              <Info className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">הזמנות קבוצתיות ואירועים</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              חוגגים יום הולדת או ערב חברה? <br />
              דברו איתנו ונתפור לכם תפריט המבורגר ופיצות בהתאמה אישית.
            </p>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-8 border-t border-slate-900/60 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">🍔</div>
            <span className="font-bold text-white text-base">קראנץ׳ & סלייס</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            כל הזכויות שמורות © {new Date().getFullYear()} קראנץ׳ & סלייס בע״מ. <br />
            התמונות להמחשה בלבד, המחירים כוללים מע״מ. הזמנות בכפוף לאזורי החלוקה.
          </p>
        </div>
      </footer>

    </div>
  );
}