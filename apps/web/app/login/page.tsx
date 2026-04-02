'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../src/components/auth/AuthProvider';
import { GridBackground } from '../../components/home';
import { fadeUp, staggerContainer } from '../../components/home/motion-variants';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccentButton } from '../../components/ui/AccentButton';

import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
    } catch (err) {
      setError((err as Error).message || 'Authentication failed. Please check your credentials.');
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

      <div className="relative z-10 flex min-h-screen pt-10 md:pt-5 flex-col lg:flex-row max-w-[1600px] mx-auto">
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
              Access the <br />
              <span className="text-zinc-600">financial engine.</span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mb-12 text-lg text-zinc-400 leading-relaxed max-w-lg"
            >
              The unified protocol for expense management and collaborative finance. Sign in to resume your operations.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-6">
              {[
                { title: 'Secure Vault', sub: 'End-to-end encrypted session keys.', icon: Lock },
                { title: 'Verified Nodes', sub: 'Institutional-grade access control.', icon: ShieldCheck }
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
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
                  <p className="text-sm text-zinc-500">Resume your collaborative financial operations.</p>
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
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-bold text-zinc-500">Password</label>
                      <Link href="/forgot-password" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                        Forgot?
                      </Link>
                    </div>
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

                  <div className="pt-4">
                    <AccentButton 
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 text-base font-bold"
                      variant="primary"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" /> Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In <ArrowRight size={18} />
                        </span>
                      )}
                    </AccentButton>
                  </div>

                  <p className="pt-8 text-center text-xs font-medium text-zinc-500">
                    New to the ecosystem?{' '}
                    <Link className="text-white hover:text-purple-400 font-bold transition-all" href="/register">
                      Create an account
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

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#030303]" />}>
      <LoginContent />
    </Suspense>
  );
}
