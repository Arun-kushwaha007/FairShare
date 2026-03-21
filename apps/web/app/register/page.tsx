'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Chrome,
  Apple,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../src/components/auth/AuthProvider';
import { GridBackground } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-purple-500/30 font-sans">
      <GridBackground />
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col pt-10 md:pt-5 lg:flex-row max-w-[1600px] mx-auto">
        {/* Left Side: Brand & Value Prop */}
        <div className="hidden md:flex flex-1 flex-col justify-center px-8 py-0 -mt-32 lg:px-20 xl:px-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
        

            <motion.h1 
              variants={fadeUp}
              className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[1.1] text-white mb-8"
            >
              The standard for <br />
              <span className="text-zinc-600">shared finances.</span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mb-12 text-lg text-zinc-400 leading-relaxed max-w-lg"
            >
              Experience the machinery of transparent expense distribution. Built for individuals and teams who value precision and security.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-6">
              {[
                { title: 'Global Settlement', sub: 'Instant reconciliation across any currency.', icon: ShieldCheck },
                { title: 'Enterprise Security', sub: 'Multi-layer encryption at every node.', icon: Lock }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] group-hover:border-purple-500/30 group-hover:bg-purple-500/5 transition-all">
                    <item.icon size={18} className="text-zinc-500 group-hover:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* <motion.div variants={fadeUp} className="mt-16 flex items-center gap-4 py-4 px-5 rounded-2xl border border-white/5 bg-white/[0.02] w-fit">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-[#030303] bg-zinc-800" />
                ))}
              </div>
              <p className="text-xs font-medium text-zinc-500">
                Joined by over <span className="text-white font-bold">12,000+</span> professionals
              </p>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Right Side: Identity Form */}
        <div className="relative flex flex-1 items-center justify-center px-6 py-20 lg:px-12 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[480px]"
          >
            <GlassCard className="relative p-8 md:p-12 border-white/5 bg-white/[0.01] overflow-hidden">
              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
                  <p className="text-sm text-zinc-500">Enter your details to begin the initialization.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-xs font-medium text-red-500"
                      >
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Full Name</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        disabled={loading}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-zinc-700 outline-none focus:border-purple-500/30 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@fairshare.com"
                        disabled={loading}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-zinc-700 outline-none focus:border-purple-500/30 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm font-medium text-white placeholder-zinc-700 outline-none focus:border-purple-500/30 focus:bg-white/[0.05] transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 py-1">
                    <input type="checkbox" className="mt-1 h-3.5 w-3.5 rounded border-white/10 bg-white/5 checked:bg-purple-600 transition-all cursor-pointer" id="terms" required />
                    <label htmlFor="terms" className="text-[11px] font-medium text-zinc-500 leading-normal cursor-pointer hover:text-zinc-300 transition-colors">
                      By signing up, you agree to our <Link href="/terms" className="text-white hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>

                  <div className="pt-4">
                    <AccentButton 
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 text-base font-bold"
                      variant="primary"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" /> Initializing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Get Started <ArrowRight size={18} />
                        </span>
                      )}
                    </AccentButton>
                  </div>

                  {/* <div className="relative flex items-center gap-4 py-6">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">Continue with</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center gap-3 h-12 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-xs font-bold text-zinc-400">
                      <Chrome size={16} className="text-zinc-500" />
                      Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-3 h-12 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-xs font-bold text-zinc-400">
                      <Apple size={16} className="text-zinc-500" />
                      Apple
                    </button>
                  </div> */}

                  <p className="pt-8 text-center text-xs font-medium text-zinc-500">
                    Already registered?{' '}
                    <Link className="text-white hover:text-purple-400 font-bold transition-all" href="/login">
                      Sign in to your account
                    </Link>
                  </p>
                </form>
              </div>
            </GlassCard>


          </motion.div>
        </div>
      </div>
    </main>
  );
}
