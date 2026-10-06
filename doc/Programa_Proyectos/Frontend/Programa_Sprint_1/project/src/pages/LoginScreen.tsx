import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { mockUsers } from '@/data/mockData';
import { Truck, Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export function LoginScreen() {
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Ingrese su email y contraseña');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        setError('El email ingresado no está registrado');
        setLoading(false);
        return;
      }

      if (password !== 'demo1234') {
        setError('Contraseña incorrecta');
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      setLoading(false);
    }, 600);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 shadow-lg shadow-teal-500/30">
              <Truck size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EcoLogística Lima</h1>
              <p className="mt-1 text-sm text-teal-200">Sistema de gestión logística y optimización de rutas</p>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Leaf size={14} className="text-emerald-400" />
              <span>DistriRápido S.A.C.</span>
            </div>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl backdrop-blur"
          >
            <h2 className="mb-1 text-xl font-semibold text-white">Iniciar sesión</h2>
            <p className="mb-6 text-sm text-slate-400">Ingrese sus credenciales para acceder</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@distrirapido.pe"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-700 active:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <p className="mb-3 text-center text-xs font-medium text-slate-400">
              Credenciales de demostración (clave: <span className="font-mono text-teal-300">demo1234</span>)
            </p>
            <div className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => fillDemo(u.email)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-left transition-colors hover:border-teal-500/50 hover:bg-slate-900/70"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-300">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </div>
                  <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {u.role === 'admin' ? 'Admin' : u.role === 'operator' ? 'Operador' : 'Conductor'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
