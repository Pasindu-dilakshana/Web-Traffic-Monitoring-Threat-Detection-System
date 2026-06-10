const pool = require('../config/db');
const { analyzeTraffic } = require('../services/threatDetector');

const trafficLogger = async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip === '::1') ip = '127.0.0.1';
    
    try {
        // ==========================================
        // 1. ACTIVE DEFENSE FIREWALL CHECK
        // ==========================================
        const banCheck = await pool.query('SELECT * FROM blocked_ips WHERE ip_address = $1', [ip]);
        
        if (banCheck.rows.length > 0) {
            // Print a shield emoji in the terminal showing the firewall worked
            console.log(`🛡️ [FIREWALL BLOCKED] Banned IP rejected: ${ip}`);
            
            // Drop the connection immediately! Send a 403 Forbidden status.
            return res.status(403).json({ 
                error: "Access Denied", 
                message: "Your IP address has been permanently banned by the SIEM Active Defense Firewall." 
            });
        }
        
        // ==========================================
        // 2. LOG NORMAL TRAFFIC
        // ==========================================
        const method = req.method;
        const url = req.originalUrl;
        
        await pool.query(
            'INSERT INTO traffic_logs (ip_address, method, url) VALUES ($1, $2, $3)',
            [ip, method, url]
        );
        
        // 3. Send to Brain for Analysis
        analyzeTraffic(ip, url, method);
        
        // 4. Let the safe user continue to the website
        next(); 
        
    } catch (error) {
        console.error('Error logging traffic:', error.message);
        next(); // If the database crashes, let them through so the site doesn't go down
    }
};

module.exports = trafficLogger;