import React, { useState } from 'react';

interface LoginModalProps {
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
    onLineLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onLineLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            onLogin(email, password);
            setIsLoading(false);
        }, 500);
    };

    const handleLineLogin = () => {
        setIsLoading(true);

        // Simulate LINE OAuth flow
        setTimeout(() => {
            onLineLogin();
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-black">SC</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">歡迎回來</h2>
                    <p className="text-slate-500 text-sm">登入以繼續使用 Shinchitose</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">電子郵件</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">密碼</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {isLoading ? '登入中...' : '登入'}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-4 bg-white text-slate-400 font-bold">或使用</span>
                    </div>
                </div>

                <button
                    onClick={handleLineLogin}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#00B900] text-white rounded-xl font-black hover:bg-[#00A000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    LINE 登入
                </button>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Demo: 任何 email/密碼 組合都可登入
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
