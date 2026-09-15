import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
  useScroll,

} from 'framer-motion';
import {
  Sun,
  Droplets,
  Wind,
  ChevronRight,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Menu,
  X,
  Leaf,
  Package,
  Star,
  Phone,
  Mail,
  MapPin,
  AtSign,
  Globe,
  Truck,
  Shield,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

interface PlantSpecimen {
  id: string;
  name: string;
  botanicalName: string;
  category: string;
  lightReq: string;
  waterReq: string;
  humidity: string;
  price: number;
  origin: string;
  image: string;
  badge?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  airPurification: number; // 1-5
}

const SPECIMENS: PlantSpecimen[] = [
  {
    id: 'monstera',
    name: 'Swiss Cheese Monstera',
    botanicalName: 'Monstera Deliciosa Var. Sierrana',
    category: 'Araceae',
    lightReq: 'Bright Indirect',
    waterReq: 'Weekly',
    humidity: '65%+',
    price: 84,
    origin: 'Oaxaca Rainforests',
    image: '/monstera.jpg',
    badge: 'Rare Cultivar',
    description:
      'Iconic split leaves engineered by nature to maximize light penetration under dense rainforest canopies. A living sculpture for your interior.',
    difficulty: 'Beginner',
    airPurification: 4,
  },
  {
    id: 'calathea',
    name: 'Silver Ribbon Calathea',
    botanicalName: 'Calathea Orbifolia Specimen',
    category: 'Marantaceae',
    lightReq: 'Medium Filtered',
    waterReq: 'Bi-Weekly',
    humidity: '75%+',
    price: 62,
    origin: 'Bahia Coastal Basin',
    image: '/calathea.jpg',
    badge: 'Prayer Plant',
    description:
      'Striking metallic silver stripes that expand and fold vertically during nocturnal circadian rhythms. A natural timepiece.',
    difficulty: 'Intermediate',
    airPurification: 5,
  },
  {
    id: 'anthurium',
    name: 'Velvet Anthurium',
    botanicalName: 'Anthurium Clarinervium Noir',
    category: 'Araceae',
    lightReq: 'Dappled Canopy',
    waterReq: '5–7 Days',
    humidity: '70%+',
    price: 110,
    origin: 'Chiapas Cloud Forests',
    image: '/anthurium.jpg',
    badge: 'Collector Edition',
    description:
      'Deep matte emerald heart leaves sculpted with crystalloid white veins that shimmer in indirect light. Collector\'s prize.',
    difficulty: 'Expert',
    airPurification: 3,
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mei Lin Tan',
    role: 'Interior Designer, KL',
    quote:
      'My Monstera arrived in perfect condition — healthier than anything I\'ve found locally. The care notes were incredibly thoughtful.',
    rating: 5,
    plant: 'Swiss Cheese Monstera',
  },
  {
    id: 2,
    name: 'Arjun Nair',
    role: 'Architect, Penang',
    quote:
      'Verdant transformed my studio apartment into a living biophilic sanctuary. The plant vitality tuner really works — I can see the difference.',
    rating: 5,
    plant: 'Velvet Anthurium',
  },
  {
    id: 3,
    name: 'Sarah Hadley',
    role: 'Product Lead, Remote',
    quote:
      'The 30-day guarantee gave me confidence. When my Calathea showed stress, their botanical team responded within hours. Exceptional service.',
    rating: 5,
    plant: 'Silver Ribbon Calathea',
  },
];

const MARQUEE_ITEMS = [
  'Rare Cultivars',
  'Botanical Experts',
  'Biophilic Design',
  'Curated Specimens',
  'Live Guarantee',
  'Eco Packaging',
  'Expert Care Guides',
  'Same-Week Delivery',
];

// ─── ANIMATED NUMBER COUNTER ──────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-[#1C3827] bg-[#061009] py-4 relative z-10">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[#4ADE80] font-medium">
            <Leaf className="w-3 h-3 opacity-60 shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SCROLL REVEAL ─────────────────────────────────────────────────────────────

function RevealOnScroll({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────

function MagneticButton({
  children,
  className = '',
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Tag = href ? 'a' : 'button';

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
      <motion.div style={{ x: springX, y: springY }}>
        <Tag
          href={href}
          onClick={onClick}
          className={className}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-[#FACC15] text-[#FACC15]' : 'text-[#2D4A35]'}`}
        />
      ))}
    </div>
  );
}

// ─── AIR PURIFICATION METER ────────────────────────────────────────────────────

function AirMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-all ${
            i < level ? 'bg-[#38BDF8]' : 'bg-[#0E2116]'
          }`}
        />
      ))}
    </div>
  );
}

// ─── DIFFICULTY BADGE ──────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: PlantSpecimen['difficulty'] }) {
  const colors: Record<PlantSpecimen['difficulty'], string> = {
    Beginner: 'text-[#4ADE80] border-[#1A3F2A] bg-[#0A1F12]',
    Intermediate: 'text-[#FACC15] border-[#3D3010] bg-[#1A1508]',
    Expert: 'text-[#F87171] border-[#3D1010] bg-[#1A0808]',
  };
  return (
    <span className={`text-[9px] uppercase tracking-widest font-semibold border px-2 py-0.5 rounded-full ${colors[level]}`}>
      {level}
    </span>
  );
}

// ─── FOOTER & SUPPORT MODAL CONTENT ─────────────────────────────────────────────

interface ModalData {
  title: string;
  category: string;
  content: React.ReactNode;
}

const MODAL_CONTENT: Record<string, ModalData> = {
  'care-guides': {
    title: 'Botanical Care Guides',
    category: 'Support',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Our micro-climate care guides are crafted specifically for tropical indoor foliage in Southeast Asian homes.</p>
        <div className="space-y-3 pt-2">
          <div className="p-3 bg-[#0A1A0F] border border-[#1C3A27] rounded-xl">
            <div className="font-medium text-[#4ADE80] mb-1">1. Light & Phototropism</div>
            <p className="text-xs text-[#7AAA8E]">Keep Aroids in bright indirect ambient light (600–1200 FC). Rotate 90° weekly to ensure balanced stem growth.</p>
          </div>
          <div className="p-3 bg-[#0A1A0F] border border-[#1C3A27] rounded-xl">
            <div className="font-medium text-[#38BDF8] mb-1">2. Substrate & Hydration</div>
            <p className="text-xs text-[#7AAA8E]">Use chunky bark + perlite mix. Water deeply only when top 2 inches feel dry to touch. Never let roots sit in water.</p>
          </div>
          <div className="p-3 bg-[#0A1A0F] border border-[#1C3A27] rounded-xl">
            <div className="font-medium text-[#FACC15] mb-1">3. Humidity Tuner</div>
            <p className="text-xs text-[#7AAA8E]">Calathea and Anthurium demand 65%+ atmospheric humidity. Grouping plants together naturally raises ambient micro-humidity.</p>
          </div>
        </div>
      </div>
    ),
  },
  'plant-doctor': {
    title: 'Plant Doctor & Diagnostics',
    category: 'Support',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Troubleshoot leaf stress, yellowing margins, or root challenges with our botanical diagnostic matrix.</p>
        <div className="grid grid-cols-1 gap-3 pt-1">
          <div className="p-3 bg-[#1A1208] border border-[#3D2C10] rounded-xl">
            <span className="text-xs font-semibold text-[#FACC15] block mb-1">Yellowing Lower Leaves</span>
            <p className="text-xs text-[#B5A478]">Most commonly caused by over-watering or dense soil compaction. Allow soil to dry further between waterings.</p>
          </div>
          <div className="p-3 bg-[#1A0808] border border-[#3D1010] rounded-xl">
            <span className="text-xs font-semibold text-[#F87171] block mb-1">Crispy Brown Leaf Tips</span>
            <p className="text-xs text-[#C98A8A]">Indicates low relative humidity (&lt;50%) or tap water mineral accumulation. Use filtered water and a humidifier.</p>
          </div>
          <div className="p-3 bg-[#08181A] border border-[#10343D] rounded-xl">
            <span className="text-xs font-semibold text-[#38BDF8] block mb-1">Drooping / Loss of Turgor</span>
            <p className="text-xs text-[#8AC3C9]">Root thirst or shock. Check substrate moisture; if bone dry, perform a thorough bottom-soak for 20 minutes.</p>
          </div>
        </div>
      </div>
    ),
  },
  'delivery-info': {
    title: 'Delivery & Eco-Packaging Guarantee',
    category: 'Support',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>We deliver live tropical specimens in custom climate-controlled, shock-absorbent wooden structures across Malaysia.</p>
        <ul className="space-y-2 text-xs text-[#89B097] list-disc pl-4">
          <li><strong className="text-[#C4DDD1]">Klang Valley & Selangor:</strong> Express same-week courier delivery in dedicated plant vans.</li>
          <li><strong className="text-[#C4DDD1]">Penang, Ipoh, Melaka & JB:</strong> 2-day priority transit with thermal foil wrap.</li>
          <li><strong className="text-[#C4DDD1]">Eco Packaging:</strong> 100% biodegradable coconut coir wrap, zero single-use plastics.</li>
        </ul>
      </div>
    ),
  },
  '30-day-guarantee': {
    title: '30-Day Botanical Health Guarantee',
    category: 'Support',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Every plant from Verdant Archive is guaranteed to arrive in peak botanical vitality and thrive in your care for at least 30 days.</p>
        <p className="text-xs text-[#89B097]">If your specimen experiences severe leaf drop, root rot, or pest issues within 30 days of arrival, simply send a photo to our team via WhatsApp (+60 11-3071 9502) for a free replacement or store credit.</p>
      </div>
    ),
  },
  'returns-policy': {
    title: 'Returns & Transit Claims',
    category: 'Support',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Because plants are live biological specimens, standard returns are handled with care to prevent plant distress.</p>
        <p className="text-xs text-[#89B097]">If a pot is damaged during transit or if the plant arrives with broken main stems, notify us within 48 hours for immediate replacement dispatches.</p>
      </div>
    ),
  },
  'about-verdant': {
    title: 'About Verdant Archive',
    category: 'Company',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Founded in 2024, Verdant Archive is a boutique nursery dedicated to preserving and propagating rare tropical cultivars.</p>
        <p className="text-xs text-[#89B097]">We bridge interior design and botany, bringing sustainable cloud-forest species directly into contemporary urban sanctuaries.</p>
      </div>
    ),
  },
  'our-botanists': {
    title: 'Our Botanical Team',
    category: 'Company',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>Our resident horticulturists specialize in Araceae, Marantaceae, and epiphytic flora with over 15 years of nursery propagation experience.</p>
        <p className="text-xs text-[#89B097]">Every plant undergoes a 14-day acclimation audit in our greenhouse before being cleared for client delivery.</p>
      </div>
    ),
  },
  'sustainability': {
    title: 'Sustainability & Ethos',
    category: 'Company',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>100% of our plants are ethically tissue-cultured or farm-propagated. We never harvest wild specimens from natural habitats.</p>
        <p className="text-xs text-[#89B097]">We use organic neem-based pest control, recycled rainwater irrigation systems, and peat-free potting media.</p>
      </div>
    ),
  },
  'press-media': {
    title: 'Press & Media Enquiries',
    category: 'Company',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>For editorial features, commercial interior design sourcing, or architectural collaborations, reach out to our press liaison:</p>
        <div className="p-3 bg-[#0A1A0F] border border-[#1C3A27] rounded-xl text-xs text-[#4ADE80]">
          Email: press@verdant.my<br />
          Media Kit: Available upon request
        </div>
      </div>
    ),
  },
  'careers': {
    title: 'Careers at Verdant',
    category: 'Company',
    content: (
      <div className="space-y-4 text-sm text-[#A7C4B2]">
        <p>We are always looking for passionate plant specialists, greenhouse technicians, and biophilic interior designers.</p>
        <p className="text-xs text-[#89B097]">Send your portfolio and CV to <strong className="text-[#4ADE80]">careers@verdant.my</strong> with subject line "Botanical Career Application".</p>
      </div>
    ),
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    category: 'Legal',
    content: (
      <div className="space-y-3 text-xs text-[#89B097]">
        <p>Verdant Archive Sdn. Bhd. respects your privacy. We collect only necessary delivery coordinates and contact details to process plant dispatches.</p>
        <p>Your details are never sold or shared with third-party advertisers. All payments are processed through encrypted payment gateways.</p>
      </div>
    ),
  },
  'terms-of-service': {
    title: 'Terms of Service',
    category: 'Legal',
    content: (
      <div className="space-y-3 text-xs text-[#89B097]">
        <p>By placing an order on Verdant Archive, you agree to our transit conditions and plant care guidelines.</p>
        <p>Plant sizes, leaf variegation patterns, and heights may naturally vary as each specimen is an authentic living organism.</p>
      </div>
    ),
  },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [moistureLevel, setMoistureLevel] = useState(65);
  const [sunlightIndex, setSunlightIndex] = useState(80);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  // Parallax on hero section
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  // Computed garden preview
  const growthScale = 0.9 + (moistureLevel / 100) * 0.2;
  const lightIntensity = 0.5 + (sunlightIndex / 100) * 0.6;
  const getPlantMood = () => {
    if (moistureLevel >= 70 && sunlightIndex >= 70) return { label: 'Thriving', color: '#4ADE80' };
    if (moistureLevel >= 50 && sunlightIndex >= 50) return { label: 'Stable', color: '#FACC15' };
    return { label: 'Stressed', color: '#F87171' };
  };
  const mood = getPlantMood();

  const filteredSpecimens = SPECIMENS.filter(
    (s) => activeCategoryFilter === 'All' || s.category === activeCategoryFilter,
  );

  const addToCart = () => setCartCount((c) => c + 1);

  return (
    <div className="min-h-screen bg-[#040906] text-[#E2EBE5] font-sans relative overflow-x-hidden selection:bg-[#1C3827] selection:text-[#9DF7C8]">

      {/* ─── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#0F2116]/60 bg-[#040906]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0D1F16] border border-[#234A33] flex items-center justify-center group-hover:border-[#4ADE80] transition-colors p-1">
              <img src="/verdant-logo.svg" alt="Verdant Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-cinzel text-base tracking-wider font-semibold text-[#F0F7F2] block leading-none">
                VERDANT
              </span>
              <span className="text-[9px] tracking-[0.22em] text-[#5A8C6E] uppercase block mt-0.5">
                Botanical Sanctuary
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-widest text-[#7AAA8E] uppercase font-medium" aria-label="Primary navigation">
            <a href="#home" className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]">Home</a>
            <a href="#simulator" className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]">Simulator</a>
            <a href="#specimens" className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]">Specimens</a>
            <a href="#sanctuary" className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]">Sanctuary</a>
            <a href="#contact" className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={addToCart}
              className="relative p-2 rounded-lg bg-[#0D1F16] border border-[#1E3B29] text-[#9DF7C8] hover:border-[#4ADE80] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
              aria-label={`View Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-4.5 px-1 rounded-full bg-[#4ADE80] text-[#040906] font-bold text-[9px] flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#93B8A2] rounded-lg hover:bg-[#0D1F16] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-[#06110A] border-l border-[#1A3626] z-50 flex flex-col p-8 gap-1"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="self-end mb-8 text-[#5E8C70]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {['home', 'simulator', 'specimens', 'sanctuary', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-sm uppercase tracking-widest text-[#93B8A2] hover:text-[#4ADE80] border-b border-[#122419] transition-colors"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <div className="mt-auto pt-6 text-xs text-[#3D6B52]">
                <p>+60 11-3071 9502</p>
                <p className="mt-1">hello@verdant.my</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── HERO: SPLIT EDITORIAL VIEWPORT ─────────────────────────────────── */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex flex-col md:flex-row overflow-hidden pt-16 sm:pt-18"
      >
        {/* LEFT: Typography Column */}
        <div className="relative z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-16 pt-12 pb-16 md:py-0 md:w-[52%] lg:w-[48%]">
          {/* Pre-title tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <div className="w-8 h-px bg-[#4ADE80]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#4ADE80] font-medium">
              Digital Botanical Nursery · Est. 2022
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-title text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.95] font-normal tracking-tight text-[#F2F7F4] mb-6"
          >
            Living
            <br />
            <em className="text-[#5CE692]" style={{ fontStyle: 'italic' }}>
              Spaces.
            </em>
            <br />
            Rare
            <br />
            Flora.
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base text-[#89B097] font-light leading-relaxed max-w-sm mb-10"
          >
            Rare tropical specimens curated from the world's most biodiverse rainforests. Delivered alive. Guaranteed thriving.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4 mb-14"
          >
            <MagneticButton
              href="#specimens"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#4ADE80] hover:bg-[#35C96B] text-[#030F06] text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#4ADE80]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040906]"
            >
              Browse Specimens
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <a
              href="#simulator"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#254C34] text-[#9BBBA6] text-sm font-medium tracking-wide hover:border-[#4ADE80] hover:text-[#4ADE80] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
            >
              Try the Simulator
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 border-t border-[#0F2419] pt-8"
          >
            {[
              { value: 340, suffix: '+', label: 'Specimens' },
              { value: 2800, suffix: '+', label: 'Families Served' },
              { value: 98, suffix: '%', label: 'Survival Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#9DF7C8] leading-none mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#4A7559]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Full-bleed botanical photo with editorial overlay */}
        <div className="relative md:w-[52%] lg:w-[52%] min-h-[55vw] md:min-h-0 overflow-hidden">
          {/* Dark vignette on left for typography bleed */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#040906] to-transparent z-10 pointer-events-none" />
          {/* Top vignette */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-[#040906] to-transparent z-10 pointer-events-none" />

          {/* Hero Image with parallax */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 scale-110"
          >
            <img
              src="/hero-bg.jpg"
              alt="Verdant nursery botanical sanctuary with lush tropical plants"
              className="w-full h-full object-cover"
              loading="eager"
              onLoad={() => setHeroImageLoaded(true)}
            />
            {/* Atmospheric dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 70% at 60% 40%, rgba(74,222,128,${0.04 * lightIntensity}) 0%, rgba(4,9,6,0.45) 100%)`,
              }}
            />
          </motion.div>

          {/* Floating specimen badge cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: heroImageLoaded ? 1 : 0, x: heroImageLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-8 right-6 z-20 bg-[#06110A]/90 border border-[#1C3827] rounded-2xl p-4 backdrop-blur-xl max-w-45 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#254C34] shrink-0 bg-[#061209]">
                <img src="/monstera.jpg" alt="Monstera" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#E2F7EB] leading-none">Just delivered</div>
                <div className="text-[9px] text-[#5E8C70] mt-0.5">Swiss Cheese Monstera</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#5CE692]">
              <CheckCircle2 className="w-3 h-3" />
              Acclimated & thriving
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: heroImageLoaded ? 1 : 0, x: heroImageLoaded ? 0 : -20 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="absolute top-20 right-6 z-20 bg-[#06110A]/90 border border-[#1C3827] rounded-xl px-3 py-2 backdrop-blur-xl shadow-xl"
          >
            <div className="text-[9px] text-[#5A8C6E] uppercase tracking-wider mb-0.5">Rare Collection</div>
            <div className="text-[11px] font-semibold text-[#9DF7C8]">340+ specimens</div>
          </motion.div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-widest text-[#3D6B52]">Scroll</span>
          <div className="w-px h-8 bg-linear-to-b from-[#4ADE80] to-transparent" />
        </motion.div>
      </section>

      {/* ─── MARQUEE ─────────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ─── GARDEN SIMULATOR SECTION ────────────────────────────────────────── */}
      <section id="simulator" className="py-24 bg-[#030805] border-b border-[#0F2116]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <RevealOnScroll>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-6 h-px bg-[#4ADE80]" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">
                  Signature Interaction
                </span>
              </div>
              <h2 className="font-serif-title text-4xl md:text-5xl lg:text-6xl leading-none text-[#F2F7F4] font-normal">
                Your Indoor
                <br />
                <em className="italic" style={{ fontStyle: 'italic' }}>Climate Studio</em>
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <p className="text-sm text-[#7AA88C] leading-relaxed mt-3 md:mt-12 max-w-md">
                Dial in your real space conditions. Our plant simulator dynamically previews how each specimen responds to your moisture levels and light environment — before you buy.
              </p>
            </RevealOnScroll>
          </div>

          {/* Simulator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <RevealOnScroll className="h-full">
              <div className="h-full bg-[#07130C] border border-[#1C3827] rounded-2xl p-6 sm:p-8 space-y-8">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-[#4ADE80]" />
                  <span className="text-xs uppercase tracking-widest text-[#4ADE80] font-semibold">Environment Controls</span>
                </div>

                {/* Moisture */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-[#A1C5AF] font-medium" htmlFor="moisture-slider">
                      <Droplets className="w-4 h-4 text-[#38BDF8]" />
                      Soil Moisture
                    </label>
                    <span className="text-[#38BDF8] font-mono text-sm font-semibold tabular-nums">{moistureLevel}%</span>
                  </div>
                  <div className="relative">
                    <input
                      id="moisture-slider"
                      type="range"
                      min="20"
                      max="100"
                      value={moistureLevel}
                      onChange={(e) => setMoistureLevel(Number(e.target.value))}
                      className="simulator-range w-full h-2 rounded-full cursor-pointer appearance-none bg-[#0E2116]"
                      style={{ accentColor: '#38BDF8' }}
                    />
                    {/* Track fill */}
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#38BDF8]/60 pointer-events-none transition-all duration-100"
                      style={{ width: `${((moistureLevel - 20) / 80) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#3D6B52] uppercase tracking-wider">
                    <span>Arid</span><span>Moist</span><span>Saturated</span>
                  </div>
                </div>

                {/* Sunlight */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-[#A1C5AF] font-medium" htmlFor="sunlight-slider">
                      <Sun className="w-4 h-4 text-[#FACC15]" />
                      Canopy Light Index
                    </label>
                    <span className="text-[#FACC15] font-mono text-sm font-semibold tabular-nums">{sunlightIndex} FC</span>
                  </div>
                  <div className="relative">
                    <input
                      id="sunlight-slider"
                      type="range"
                      min="30"
                      max="100"
                      value={sunlightIndex}
                      onChange={(e) => setSunlightIndex(Number(e.target.value))}
                      className="simulator-range w-full h-2 rounded-full cursor-pointer appearance-none bg-[#0E2116]"
                      style={{ accentColor: '#FACC15' }}
                    />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#FACC15]/50 pointer-events-none transition-all duration-100"
                      style={{ width: `${((sunlightIndex - 30) / 70) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#3D6B52] uppercase tracking-wider">
                    <span>Deep Shade</span><span>Filtered</span><span>Bright</span>
                  </div>
                </div>

                {/* Plant Status Summary */}
                <div className="border-t border-[#122419] pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#4A7559] mb-1">Plant Status</div>
                      <div className="font-mono text-base font-bold" style={{ color: mood.color }}>
                        {mood.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-[#4A7559] mb-1">Scale Factor</div>
                      <div className="font-mono text-base font-bold text-[#9DF7C8]">
                        ×{growthScale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Live Plant Preview */}
            <RevealOnScroll delay={0.1} className="h-full">
              <div className="h-full bg-[#07130C] border border-[#1C3827] rounded-2xl overflow-hidden relative min-h-100">
                {/* Atmospheric aura from sliders */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-700"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(74,222,128,${0.08 * lightIntensity}), transparent 70%), radial-gradient(ellipse 60% 50% at 30% 80%, rgba(56,189,248,${0.06 * (moistureLevel / 100)}), transparent 70%)`,
                  }}
                />

                {/* Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(to right, #1C3827 1px, transparent 1px), linear-gradient(to bottom, #1C3827 1px, transparent 1px)',
                  backgroundSize: '3rem 3rem',
                }} />

                {/* Plant preview — clean 3-plant grid */}
                <div className="relative h-full flex flex-col p-5 gap-4">
                  {/* Top row: 3 specimen circles */}
                  <div className="flex items-end justify-around gap-3 flex-1">
                    {/* Calathea — small */}
                    <motion.div
                      animate={{ scale: growthScale * 0.88 }}
                      transition={{ type: 'spring', stiffness: 50, damping: 22 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#0A0F0A] border border-[#38BDF8]/30 shadow-[0_0_20px_rgba(56,189,248,0.1)] flex items-center justify-center">
                        <img
                          src="/calathea.jpg"
                          alt="Calathea"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#3D6B52] uppercase tracking-wider">Calathea</span>
                    </motion.div>

                    {/* Monstera — large / hero plant */}
                    <motion.div
                      animate={{ scale: growthScale * 1.05 }}
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-[#061209] border-2 shadow-[0_0_30px_rgba(74,222,128,0.15)] flex items-center justify-center"
                        style={{ borderColor: mood.color + '50' }}>
                        <img
                          src="/monstera.jpg"
                          alt="Monstera"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#3D6B52] uppercase tracking-wider">Monstera</span>
                    </motion.div>

                    {/* Anthurium — medium */}
                    <motion.div
                      animate={{ scale: growthScale * 0.92 }}
                      transition={{ type: 'spring', stiffness: 55, damping: 22, delay: 0.05 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#0A0F0A] border border-[#FACC15]/25 shadow-[0_0_20px_rgba(250,204,21,0.08)] flex items-center justify-center">
                        <img
                          src="/anthurium.jpg"
                          alt="Anthurium"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#3D6B52] uppercase tracking-wider">Anthurium</span>
                    </motion.div>
                  </div>

                  {/* Status bar at bottom */}
                  <div className="flex items-center justify-between bg-[#040A07]/80 border border-[#122419] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: mood.color }} />
                      <span className="font-mono text-xs font-semibold" style={{ color: mood.color }}>{mood.label}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-[10px] text-[#3D6B52]">
                      <span><span className="text-[#38BDF8]">{moistureLevel}%</span> moisture</span>
                      <span className="hidden sm:inline"><span className="text-[#FACC15]">{sunlightIndex} FC</span> light</span>
                      <span>×{growthScale.toFixed(2)} scale</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── RARE SPECIMEN COLLECTION ─────────────────────────────────────────── */}
      <section id="specimens" className="py-24 border-b border-[#0F2116]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <RevealOnScroll>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">Botanical Collection</span>
                </div>
                <h2 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl leading-none text-[#F2F7F4] font-normal">
                  Rare Architectural
                  <br />
                  Specimens
                </h2>
              </div>
            </RevealOnScroll>

            {/* Filter Pills */}
            <RevealOnScroll delay={0.1}>
              <div className="flex items-center gap-1.5 bg-[#07130C] border border-[#1A3324] p-1.5 rounded-xl self-start sm:self-end">
                {['All', 'Araceae', 'Marantaceae'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] ${
                      activeCategoryFilter === cat
                        ? 'bg-[#1C3E2B] text-[#4ADE80] font-semibold shadow-sm'
                        : 'text-[#5E8C70] hover:text-[#C4DDD1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Asymmetric 3-col grid: first card tall, others normal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategoryFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSpecimens.map((plant, idx) => (
                <RevealOnScroll key={plant.id} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                    transition={{ duration: 0.25 }}
                    className={`bg-[#07130C] border border-[#1A3324] hover:border-[#2D5A3F] rounded-2xl overflow-hidden flex flex-col group transition-colors ${
                      idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden bg-[#061209]"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <img
                        src={plant.image}
                        alt={plant.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Badge */}
                      {plant.badge && (
                        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-[#040906]/90 border border-[#254C34] text-[#4ADE80] backdrop-blur-sm">
                          {plant.badge}
                        </span>
                      )}
                      {/* Difficulty */}
                      <span className="absolute top-3 right-3">
                        <DifficultyBadge level={plant.difficulty} />
                      </span>
                      {/* Bottom gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#061209] to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="text-[10px] font-mono text-[#4A7559] mb-1 uppercase tracking-wider">
                        {plant.category} · {plant.origin}
                      </div>
                      <h3 className="font-serif-title text-xl text-[#EAF5EF] mb-0.5 leading-tight">{plant.name}</h3>
                      <p className="text-[11px] italic text-[#5E8C70] mb-3 font-serif-title">{plant.botanicalName}</p>
                      <p className="text-xs text-[#7AA88C] leading-relaxed font-light flex-1 mb-5">{plant.description}</p>

                      {/* Care specs */}
                      <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-[#040A07] border border-[#0F2116]">
                        <div className="text-center">
                          <Sun className="w-3.5 h-3.5 text-[#FACC15] mx-auto mb-1" />
                          <div className="text-[9px] text-[#3D6B52] uppercase tracking-wide">Light</div>
                          <div className="text-[10px] text-[#89B097] font-medium mt-0.5 leading-tight">{plant.lightReq}</div>
                        </div>
                        <div className="text-center border-x border-[#0F2116]">
                          <Droplets className="w-3.5 h-3.5 text-[#38BDF8] mx-auto mb-1" />
                          <div className="text-[9px] text-[#3D6B52] uppercase tracking-wide">Water</div>
                          <div className="text-[10px] text-[#89B097] font-medium mt-0.5 leading-tight">{plant.waterReq}</div>
                        </div>
                        <div className="text-center">
                          <Wind className="w-3.5 h-3.5 text-[#A78BFA] mx-auto mb-1" />
                          <div className="text-[9px] text-[#3D6B52] uppercase tracking-wide">Humidity</div>
                          <div className="text-[10px] text-[#89B097] font-medium mt-0.5 leading-tight">{plant.humidity}</div>
                        </div>
                      </div>

                      {/* Air purification */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#3D6B52] mb-1.5">Air Purification</div>
                          <AirMeter level={plant.airPurification} />
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider text-[#3D6B52]">Investment</div>
                          <div className="text-xl font-bold font-mono text-[#9DF7C8]">${plant.price}</div>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={addToCart}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0E2417] hover:bg-[#1A3D2A] border border-[#254C34] hover:border-[#4ADE80] text-[#C4EDD6] text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
                        aria-label={`Add ${plant.name} to cart`}
                      >
                        <span>Adopt this Plant</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── SANCTUARY CARE PILLARS ───────────────────────────────────────────── */}
      <section id="sanctuary" className="py-24 bg-[#030805] border-b border-[#0F2116]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealOnScroll className="mb-16">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#4ADE80]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">Why Verdant</span>
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl leading-none text-[#F2F7F4] font-normal">
              The Sanctuary
              <br />
              <em className="italic" style={{ fontStyle: 'italic' }}>Promise</em>
            </h2>
          </RevealOnScroll>

          {/* Asymmetric feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Droplets,
                iconColor: 'text-[#38BDF8]',
                iconBg: 'border-[#1A3D5C] bg-[#06101A]',
                title: 'Hydro-Nurture Protocol',
                desc: 'Every specimen spends 14 days in bio-secure moisture-regulated micro-chambers before dispatch — eliminating transplant shock on arrival.',
              },
              {
                icon: Wind,
                iconColor: 'text-[#A78BFA]',
                iconBg: 'border-[#2D1A5C] bg-[#0D0A1A]',
                title: 'VOC Air Purification',
                desc: 'Scientifically validated to extract indoor pollutants (formaldehyde, benzene, xylene) while raising ambient humidity in your living space.',
              },
              {
                icon: Shield,
                iconColor: 'text-[#FACC15]',
                iconBg: 'border-[#3D3010] bg-[#16100A]',
                title: '30-Day Alive Guarantee',
                desc: 'If your plant doesn\'t thrive within 30 days, we replace it. Full stop. Our botanists are on-call to diagnose and support your specific space.',
              },
              {
                icon: Truck,
                iconColor: 'text-[#4ADE80]',
                iconBg: 'border-[#1A3D2A] bg-[#060F0A]',
                title: 'Climate-Safe Delivery',
                desc: 'Temperature-controlled packaging with real-time humidity sensors inside every box. Specimens arrive as they left — pristine and hydrated.',
              },
              {
                icon: HeartHandshake,
                iconColor: 'text-[#F87171]',
                iconBg: 'border-[#3D1010] bg-[#0F0606]',
                title: 'Lifetime Plant Support',
                desc: 'WhatsApp access to our senior botanical team for the lifetime of your plant. Lighting diagnostics, watering calendars, root health checks.',
              },
              {
                icon: Package,
                iconColor: 'text-[#34D399]',
                iconBg: 'border-[#1A3D2A] bg-[#060F0A]',
                title: '100% Plastic-Free',
                desc: 'All packaging is biodegradable FSC-certified cardboard and organic moss. Zero plastic. Carbon-neutral delivery on all orders above RM200.',
              },
            ].map((pillar, i) => (
              <RevealOnScroll key={pillar.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-[#07130C] border border-[#1A3324] hover:border-[#254C34] transition-colors group h-full">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${pillar.iconBg} ${pillar.iconColor} group-hover:scale-110 transition-transform`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-title text-lg text-[#EAF5EF] mb-3 leading-tight">{pillar.title}</h4>
                  <p className="text-xs text-[#7AA88C] leading-relaxed font-light">{pillar.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS IMPACT SECTION ─────────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#0F2116] overflow-hidden relative">
        {/* Atmospheric background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,222,128,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: 340, suffix: '+', label: 'Rare Specimens', sub: 'across 85 botanical families' },
              { value: 2800, suffix: '+', label: 'Happy Plant Parents', sub: 'in Peninsular Malaysia' },
              { value: 98, suffix: '%', label: 'Survival Rate', sub: '30 days post-delivery' },
              { value: 14, suffix: ' yrs', label: 'Expert Botanists', sub: 'combined horticultural experience' },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.1}>
                <div className="text-center sm:text-left">
                  <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4ADE80] leading-none mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-semibold text-[#D1E5D9] mb-1">{stat.label}</div>
                  <div className="text-[11px] text-[#4A7559] leading-snug">{stat.sub}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#030805] border-b border-[#0F2116]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealOnScroll className="mb-16">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#4ADE80]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">Community</span>
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl leading-none text-[#F2F7F4] font-normal">
              Grown by our
              <br />
              <em className="italic" style={{ fontStyle: 'italic' }}>Community</em>
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <RevealOnScroll key={t.id} delay={i * 0.1}>
                <div className={`p-6 rounded-2xl border bg-[#07130C] transition-all flex flex-col h-full ${
                  i === 1 ? 'border-[#254C34] md:-mt-4' : 'border-[#1A3324]'
                }`}>
                  <StarRating rating={t.rating} />
                  <blockquote className="text-sm text-[#B3D1C2] font-light leading-relaxed mt-4 mb-5 flex-1">
                    "{t.quote}"
                  </blockquote>
                  <div className="border-t border-[#122419] pt-4">
                    <div className="font-semibold text-[#EAF5EF] text-sm">{t.name}</div>
                    <div className="text-[11px] text-[#4A7559] mt-0.5">{t.role}</div>
                    <div className="text-[10px] text-[#3D6B52] mt-1.5 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Owner of {t.plant}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER / CTA BANNER ──────────────────────────────────────────── */}
      <section className="py-24 border-b border-[#0F2116] relative overflow-hidden">
        {/* Botanical background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 80% 50%, rgba(74,222,128,0.06), transparent 70%), radial-gradient(ellipse 50% 60% at 10% 50%, rgba(56,189,248,0.04), transparent 70%)',
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #4ADE80 0, #4ADE80 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <RevealOnScroll>
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <div className="w-6 h-px bg-[#4ADE80]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">Newsletter</span>
              <div className="w-6 h-px bg-[#4ADE80]" />
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl leading-[1.05] text-[#F2F7F4] font-normal mb-5">
              Join the Botanical
              <br />
              <em className="italic text-[#5CE692]" style={{ fontStyle: 'italic' }}>Inner Circle</em>
            </h2>
            <p className="text-sm text-[#7AA88C] font-light mb-10 max-w-md mx-auto">
              Monthly drops of rare specimens, seasonal care calendars, and exclusive early access — only for our plant community.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (emailInput.trim()) setSubscribed(true);
                  }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    autoComplete="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-3.5 rounded-xl bg-[#07130C] border border-[#1C3827] text-[#E2EBE5] placeholder-[#3D6B52] text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent transition-all"
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-[#4ADE80] hover:bg-[#35C96B] text-[#030F06] font-semibold text-sm tracking-wide transition-all shadow-lg shadow-[#4ADE80]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040906] whitespace-nowrap"
                  >
                    Join the Circle
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-[#4ADE80]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Welcome to the inner circle — check your inbox.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── CONTACT SECTION ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 border-b border-[#0F2116] bg-[#030805]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <RevealOnScroll>
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-6 h-px bg-[#4ADE80]" />
                  <span className="text-[11px] tracking-[0.28em] uppercase text-[#4ADE80] font-medium">Reach Us</span>
                </div>
                <h2 className="font-serif-title text-4xl sm:text-5xl leading-none text-[#F2F7F4] font-normal mb-6">
                  Speak to a
                  <br />
                  <em className="italic" style={{ fontStyle: 'italic' }}>Botanist</em>
                </h2>
                <p className="text-sm text-[#7AA88C] font-light leading-relaxed max-w-md mb-10">
                  Our team of horticultural specialists is available to help you find the perfect plant for your interior, lighting conditions, and lifestyle.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: 'WhatsApp', value: '+60 11-3071 9502', href: 'https://wa.me/601130719502' },
                    { icon: Mail, label: 'Email', value: 'hello@verdant.my', href: 'mailto:hello@verdant.my' },
                    { icon: MapPin, label: 'Nursery', value: 'Bangsar South, Kuala Lumpur', href: '#' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[#07130C] border border-[#1A3324] hover:border-[#254C34] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#0A1A0F] border border-[#1A3324] flex items-center justify-center text-[#4ADE80] shrink-0 group-hover:border-[#4ADE80] transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#3D6B52]">{item.label}</div>
                        <div className="text-sm text-[#C4DDD1] font-medium mt-0.5">{item.value}</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#254C34] group-hover:text-[#4ADE80] ml-auto transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Care hours + quick specs */}
            <RevealOnScroll delay={0.15}>
              <div className="bg-[#07130C] border border-[#1C3827] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#4A7559] font-medium">Operating Hours</div>
                {[
                  { day: 'Mon – Fri', hours: '9:00 AM – 7:00 PM' },
                  { day: 'Saturday', hours: '10:00 AM – 5:00 PM' },
                  { day: 'Sunday', hours: 'Online consultations only' },
                ].map((h) => (
                  <div key={h.day} className="flex items-center justify-between border-b border-[#0F2116] pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-[#89B097]">{h.day}</span>
                    <span className="text-sm font-medium text-[#C4DDD1]">{h.hours}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="text-xs uppercase tracking-widest text-[#4A7559] font-medium mb-4">Delivery Coverage</div>
                  <div className="flex flex-wrap gap-2">
                    {['KL & Selangor', 'Penang', 'Johor Bahru', 'Ipoh', 'Melaka'].map((city) => (
                      <span key={city} className="text-[10px] px-2.5 py-1 rounded-full bg-[#0A1A0F] border border-[#1A3324] text-[#5E8C70] uppercase tracking-wider">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="pt-16 pb-8 bg-[#030805]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0D1F16] border border-[#234A33] flex items-center justify-center p-1">
                  <img src="/verdant-logo.svg" alt="Verdant Emblem" className="w-full h-full object-contain" />
                </div>
                <span className="font-cinzel text-base tracking-wider font-semibold text-[#F0F7F2]">VERDANT</span>
              </div>
              <p className="text-xs text-[#4A7559] leading-relaxed mb-5 max-w-50">
                Rare tropical specimens curated from biodiverse rainforests. Living design for modern spaces.
              </p>
              <div className="flex items-center gap-3">
                {[{ Icon: AtSign, label: 'Instagram' }, { Icon: Globe, label: 'Website' }].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-8 h-8 rounded-lg border border-[#1A3324] bg-[#07130C] flex items-center justify-center text-[#4A7559] hover:text-[#4ADE80] hover:border-[#4ADE80] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
                    aria-label={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:col-span-3 gap-8">
              {/* Collection column */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#4ADE80] font-semibold mb-4">Collection</div>
                <ul className="space-y-2.5">
                  {[
                    { label: 'All Specimens', filter: 'All' },
                    { label: 'Araceae Family', filter: 'Araceae' },
                    { label: 'Marantaceae', filter: 'Marantaceae' },
                    { label: 'Rare Cultivars', filter: 'All' },
                    { label: 'Collector Editions', filter: 'Araceae' },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href="#specimens"
                        onClick={() => setActiveCategoryFilter(item.filter)}
                        className="text-xs text-[#4A7559] hover:text-[#89B097] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support column */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#4ADE80] font-semibold mb-4">Support</div>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Care Guides', key: 'care-guides' },
                    { label: 'Plant Doctor', key: 'plant-doctor' },
                    { label: 'Delivery Info', key: 'delivery-info' },
                    { label: '30-Day Guarantee', key: '30-day-guarantee' },
                    { label: 'Returns Policy', key: 'returns-policy' },
                  ].map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => setActiveModalKey(item.key)}
                        className="text-xs text-[#4A7559] hover:text-[#89B097] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80] text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company column */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#4ADE80] font-semibold mb-4">Company</div>
                <ul className="space-y-2.5">
                  {[
                    { label: 'About Verdant', key: 'about-verdant' },
                    { label: 'Our Botanists', key: 'our-botanists' },
                    { label: 'Sustainability', key: 'sustainability' },
                    { label: 'Press & Media', key: 'press-media' },
                    { label: 'Careers', key: 'careers' },
                  ].map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => setActiveModalKey(item.key)}
                        className="text-xs text-[#4A7559] hover:text-[#89B097] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80] text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#0F2116] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-[#2D4A35]">© 2026 Verdant Archive Sdn. Bhd. · All rights reserved.</span>
            <div className="flex items-center gap-5 text-[11px] text-[#2D4A35]">
              <button
                onClick={() => setActiveModalKey('privacy-policy')}
                className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModalKey('terms-of-service')}
                className="hover:text-[#4ADE80] transition-colors focus-visible:outline-none focus-visible:text-[#4ADE80]"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── INTERACTIVE MODAL DIALOG ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModalKey && MODAL_CONTENT[activeModalKey] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setActiveModalKey(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-[#07130C] border border-[#1C3E2B] rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10"
            >
              <div className="flex items-center justify-between border-b border-[#12271C] pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#4ADE80] font-mono">
                    {MODAL_CONTENT[activeModalKey].category}
                  </span>
                  <h3 className="text-lg font-cinzel font-bold text-[#F0F7F2]">
                    {MODAL_CONTENT[activeModalKey].title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalKey(null)}
                  className="p-1.5 rounded-lg text-[#5E8C70] hover:text-[#4ADE80] hover:bg-[#0E2619] transition-colors focus-visible:outline-none"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-2">{MODAL_CONTENT[activeModalKey].content}</div>

              <div className="pt-5 mt-4 border-t border-[#12271C] flex justify-end">
                <button
                  onClick={() => setActiveModalKey(null)}
                  className="px-4 py-2 rounded-xl bg-[#1C3E2B] text-[#4ADE80] text-xs font-semibold hover:bg-[#254C34] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
