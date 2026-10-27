import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { authService } from '@/services/auth';
import { Truck, Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export function LoginScreen() {
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Ingrese su email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signIn(email.trim(), password);
      setCurrentUser(user);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (msg.includes('Perfil no encontrado')) {
        setError('El usuario no tiene perfil asignado. Contacte al administrador.');
      } else {
        setError('No se pudo iniciar sesión. Verifique sus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
              <Truck size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EcoLogística Lima</h1>
              <p className="mt-1 text-sm text-blue-200">Sistema de gestión logística y optimización de rutas</p>
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
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@distrirapido.pe"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>
      </div>
    </div>
  );
}
