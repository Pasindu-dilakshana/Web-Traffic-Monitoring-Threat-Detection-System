import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: username,
                password: password
            });
            
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); 
            
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Connection Refused'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black animate-gradient-x px-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-blue-500/20 mb-4 border border-blue-500/30">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">SIEM <span className="text-blue-400">PORTAL</span></h2>
                    <p className="text-gray-400 mt-2 text-sm">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="group">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                            required 
                        />
                    </div>
                    <div className="group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-3 rounded-lg text-sm text-center font-medium animate-bounce ${message.includes('✅') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;