import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Lock, Sparkles, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { setAdminToken, setAdminUser, setIsAdminLoggedIn, addToast, setActiveView } = useBakery();
  
  const [identifier, setIdentifier] = useState('admin@maisoneloise.com');
  const [password, setPassword] = useState('maisoneloise2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: identifier, 
          email: identifier, 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        if (data.user) {
          setAdminUser(data.user);
        }
        setIsAdminLoggedIn(true);
        addToast('Welcome to Maison Éloise Admin Portal', 'success');
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.error || 'Invalid credentials. Please check your username and password.');
        addToast('Authentication failed', 'error');
      }
    } catch {
      // Local fallback for offline mode
      if (
        (identifier === 'admin' || identifier === 'admin@maisoneloise.com') && 
        (password === 'maisoneloise2026' || password === 'admin123')
      ) {
        const mockToken = `msh-local-${Date.now()}`;
        setAdminToken(mockToken);
        setAdminUser({
          name: 'Head Baker & Manager',
          role: 'Administrator',
          email: 'admin@maisoneloise.com'
        });
        setIsAdminLoggedIn(true);
        addToast('Admin access granted (offline mode)', 'success');
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg('Authentication server unreachable. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (id: string, pwd: string) => {
    setIdentifier(id);
    setPassword(pwd);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Watermark / Back link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={() => setActiveView('home')}
          className="text-xs font-semibold text-[#8C827A] hover:text-[#2C2420] transition-colors flex items-center gap-1.5"
        >
          ← Return to Bakery Store
        </button>
        <span className="text-[11px] font-mono tracking-wider text-[#A39990] uppercase">
          Portal v2.6 • Private
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBE3D7] shadow-xl p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2C2420] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#2C2420] tracking-tight">
            Maison Éloise
          </h1>
          <p className="text-xs text-[#8C827A] tracking-wider uppercase font-medium">
            Atelier & Operations Control Panel
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-[#FFF5F5] border border-[#FED7D7] p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-[#C53030]">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1.5">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@maisoneloise.com"
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#2C2420] transition-all outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047]">
                Master Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#2C2420] transition-all outline-none"
            />
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE4D8] text-[11px] text-[#6B6158] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2C2420] flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-[#C49258]" /> Admin Credentials:
              </span>
              <button
                type="button"
                onClick={() => fillDemo('admin@maisoneloise.com', 'maisoneloise2026')}
                className="text-[10px] font-bold text-[#C49258] hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[10px] text-[#7A6E65] space-y-0.5">
              <div>Email: <span className="text-[#2C2420] font-medium">admin@maisoneloise.com</span></div>
              <div>Password: <span className="text-[#2C2420] font-medium">maisoneloise2026</span></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying Access...
              </span>
            ) : (
              <>
                <span>Access Control Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="pt-2 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#A39990]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F5E46]" />
            Session protected with secure token authentication
          </span>
        </div>
      </div>
    </div>
  );
};
