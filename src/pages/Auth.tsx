import React, { useState } from 'react';
import { CubeLogo } from '../components/Sidebar'; // Assuming export, if not we redefine locally or import from assets
import { Building2, User, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Smartphone, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
  const { login, register, currentUser } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
      if(currentUser) navigate('/');
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        if (isLogin) {
            await login(email);
        } else {
            await register(email, fullName, orgName);
        }
        navigate('/');
    } catch (err: any) {
        setError(err.message || "操作失败，请重试");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans selection:bg-brand-500/30">
      <div className="hidden lg:flex w-1/2 relative bg-brand-950 overflow-hidden items-center justify-center p-12">
           {/* Background Mesh/Effect */}
           <div className="absolute inset-0 z-0">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/30 via-brand-900/0 to-transparent"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
           </div>
           <div className="relative z-10 text-white max-w-lg">
                <h1 className="text-5xl font-bold leading-tight mb-6">企业级 AI 智能中枢</h1>
           </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
          <div className="w-full max-w-[420px] animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isLogin ? '欢迎回来' : '注册企业账号'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="p-3 text-red-600">{error}</div>}
                  {!isLogin && (
                      <>
                        <div><label className="block text-xs font-bold text-slate-700 uppercase mb-2">组织名称</label><input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" required={!isLogin}/></div>
                         <div><label className="block text-xs font-bold text-slate-700 uppercase mb-2">姓名</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" required={!isLogin}/></div>
                      </>
                  )}
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-2">邮箱</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" required/></div>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-2">密码</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" required/></div>
                  <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2">{loading ? <Loader2 size={18} className="animate-spin"/> : (isLogin ? '登录' : '注册')}</button>
              </form>
              <div className="mt-8 text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-brand-600 font-bold hover:underline">{isLogin ? '注册新企业' : '直接登录'}</button></div>
          </div>
      </div>
    </div>
  );
};
