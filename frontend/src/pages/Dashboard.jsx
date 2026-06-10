import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // NEW: Search state
    const [isRefreshing, setIsRefreshing] = useState(false); // NEW: Refresh state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setIsLoading(false);
            fetchData(token);
        }
    }, [navigate]);

    const fetchData = async (token) => {
        setIsRefreshing(true);
        try {
            const logRes = await axios.get('http://localhost:5000/api/admin/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(logRes.data);

            const alertRes = await axios.get('http://localhost:5000/api/admin/alerts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(alertRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        const token = localStorage.getItem('token');
        if (token) fetchData(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // NEW: Logic to filter logs based on the search bar
    const filteredLogs = logs.filter(log => 
        log.ip_address.includes(searchTerm) || 
        log.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NEW: Helper function to check if a URL is suspicious
    const isSuspicious = (url) => {
        const badUrls = ['/.env', '/wp-admin', '/admin.php', '/api/fake-hacker-page'];
        return badUrls.includes(url);
    };

    if (isLoading) return <div className="min-h-screen bg-[#0a0f1c] text-white flex items-center justify-center font-mono">Initializing Secure Environment...</div>;

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-gray-200 font-sans selection:bg-blue-500/30 pb-12">
            {/* Top Navigation */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">SIEM CONTROL <span className="text-white">CENTER</span></h1>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] cursor-pointer">
                        Disconnect
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Web Traffic</h3>
                        <p className="text-3xl font-bold text-white font-mono">{logs.length}</p>
                    </div>
                    
                    <div className={`bg-white/5 border rounded-xl p-6 relative overflow-hidden group transition-all ${alerts.length > 0 ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Active Threats Detected</h3>
                        <p className={`text-3xl font-bold font-mono ${alerts.length > 0 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>{alerts.length}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">System Status</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <p className="text-lg font-bold text-green-400">Online & Monitoring</p>
                        </div>
                    </div>
                </div>

                {/* Main Traffic Dashboard */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                    
                    {/* UI Controls Header */}
                    <div className="border-b border-white/10 px-6 py-4 bg-black/40 flex flex-wrap justify-between items-center gap-4">
                        <h2 className="text-sm font-bold tracking-widest text-gray-300 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                            LIVE TRAFFIC INTERCEPT
                        </h2>
                        
                        <div className="flex items-center gap-4">
                            {/* NEW: Search Bar */}
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search IP or URL..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-black/50 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
                                />
                            </div>

                            {/* NEW: Refresh Button */}
                            <button 
                                onClick={handleRefresh} 
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                {isRefreshing ? 'Syncing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Traffic Table */}
                    <div className="p-0 h-[350px] overflow-y-auto bg-[#05080f] font-mono text-sm relative">
                        <table className="w-full text-left border-collapse z-10 relative">
                            <thead className="sticky top-0 bg-[#0c1222] border-b border-white/10 shadow-md">
                                <tr className="text-blue-400 tracking-wider text-xs">
                                    <th className="py-3 px-6 font-semibold">TIMESTAMP</th>
                                    <th className="py-3 px-6 font-semibold">IP ADDRESS</th>
                                    <th className="py-3 px-6 font-semibold">METHOD</th>
                                    <th className="py-3 px-6 font-semibold">TARGET URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr><td colSpan="4" className="py-8 text-center text-gray-500">No matching logs found.</td></tr>
                                ) : (
                                    filteredLogs.map((log) => {
                                        // CHECK IF THIS SPECIFIC LOG IS DANGEROUS
                                        const isDanger = isSuspicious(log.url);
                                        
                                        return (
                                            <tr 
                                                key={log.id} 
                                                // IF IT'S DANGEROUS, HIGHLIGHT THE WHOLE ROW RED!
                                                className={`border-b transition-colors ${
                                                    isDanger 
                                                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400' 
                                                    : 'border-white/5 hover:bg-white/5 text-green-400'
                                                }`}
                                            >
                                                <td className={`py-3 px-6 ${isDanger ? 'text-red-400/70' : 'text-gray-400'}`}>
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </td>
                                                <td className="py-3 px-6">{log.ip_address}</td>
                                                <td className="py-3 px-6">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        isDanger ? 'bg-red-500/20 border-red-500/50 text-red-500' :
                                                        log.method === 'POST' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    }`}>
                                                        {log.method}
                                                    </span>
                                                </td>
                                                <td className={`py-3 px-6 ${isDanger ? 'font-bold' : 'text-gray-300'}`}>{log.url}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Security Alerts Table (From Phase 5) */}
                <div className="mt-6 bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden shadow-xl">
                    <div className="border-b border-red-500/20 px-6 py-3 bg-red-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <h2 className="text-xs font-bold tracking-widest text-red-400">DETECTED SECURITY INCIDENTS</h2>
                        </div>
                    </div>
                    <div className="p-0 max-h-[200px] overflow-y-auto bg-[#0a0505] font-mono text-xs">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {alerts.length === 0 ? (
                                    <tr><td colSpan="4" className="py-6 text-center text-gray-600">No security incidents detected in the current session.</td></tr>
                                ) : (
                                    alerts.map((alert) => (
                                        <tr key={alert.id} className="border-b border-red-500/10 hover:bg-red-500/10 transition-colors text-red-400">
                                            <td className="py-3 px-6 text-red-400/50">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                                            <td className="py-3 px-6 font-bold">{alert.threat_type}</td>
                                            <td className="py-3 px-6">IP: <span className="text-white">{alert.ip_address}</span></td>
                                            <td className="py-3 px-6">
                                                <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-[10px] uppercase font-bold">{alert.severity}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;