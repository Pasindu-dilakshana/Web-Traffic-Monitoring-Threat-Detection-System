const pool = require('../config/db');

const analyzeTraffic = async (ip_address, url, method) => {
    try {
        const decodedUrl = decodeURIComponent(url).toLowerCase();

        // 1. Honeypot
        const suspiciousUrls = ['/.env', '/wp-admin', '/admin.php', '/api/fake-hacker-page'];
        if (suspiciousUrls.includes(decodedUrl)) {
            await triggerAlert(ip_address, 'Suspicious Scanning', 'High');
        }

        // 2. Brute Force
        if (url === '/api/auth/login' && method === 'POST') {
            const countQuery = `SELECT COUNT(*) FROM traffic_logs WHERE ip_address = $1 AND url = '/api/auth/login' AND timestamp >= NOW() - INTERVAL '1 minute'`;
            const result = await pool.query(countQuery, [ip_address]);
            if (parseInt(result.rows[0].count) > 3) { 
                await triggerAlert(ip_address, 'Brute Force Attack', 'Critical');
            }
        }

        // 3. SQLi
        const sqliSignatures = ["'", '"', 'union select', '1=1', 'drop table'];
        if (sqliSignatures.some(sig => decodedUrl.includes(sig))) {
            await triggerAlert(ip_address, 'SQL Injection (SQLi)', 'Critical');
        }

        // 4. XSS
        const xssSignatures = ['<script>', 'javascript:', 'onerror='];
        if (xssSignatures.some(sig => decodedUrl.includes(sig))) {
            await triggerAlert(ip_address, 'Cross-Site Scripting (XSS)', 'High');
        }

        // 5. Path Traversal
        if (decodedUrl.includes('../') || decodedUrl.includes('..\\')) {
            await triggerAlert(ip_address, 'Path Traversal Attempt', 'High');
        }

    } catch (error) {
        console.error('❌ Brain Error:', error.message);
    }
};

const triggerAlert = async (ip_address, threat_type, severity) => {
    try {
        const checkQuery = `SELECT * FROM alerts WHERE ip_address = $1 AND threat_type = $2 AND timestamp >= NOW() - INTERVAL '2 minutes'`;
        const checkResult = await pool.query(checkQuery, [ip_address, threat_type]);

        if (checkResult.rows.length === 0) {
            // Save the Alert
            const insertQuery = `INSERT INTO alerts (ip_address, threat_type, severity) VALUES ($1, $2, $3)`;
            await pool.query(insertQuery, [ip_address, threat_type, severity]);
            console.log(`\n🚨 [THREAT DETECTED] ${threat_type} from IP: ${ip_address}!`);

            // ==========================================
            // ACTIVE DEFENSE BANNING LOGIC
            // ==========================================
            if (severity === 'Critical') {
                // Instant ban for Critical threats!
                await banIp(ip_address, `Instant Ban: Triggered ${threat_type}`);
            } else {
                // 3 Strikes Rule for High/Low threats
                const countQuery = `SELECT COUNT(*) FROM alerts WHERE ip_address = $1`;
                const countResult = await pool.query(countQuery, [ip_address]);
                if (parseInt(countResult.rows[0].count) >= 3) {
                    await banIp(ip_address, `3 Strikes Rule: Multiple Suspicious Activities`);
                }
            }
        }
    } catch (error) {
        console.error('DATABASE ERROR:', error.message);
    }
};

// ==========================================
// THE EXECUTIONER: Function to Ban IPs
// ==========================================
const banIp = async (ip_address, reason) => {
    try {
        const checkBanQuery = `SELECT * FROM blocked_ips WHERE ip_address = $1`;
        const result = await pool.query(checkBanQuery, [ip_address]);
        
        if (result.rows.length === 0) {
            await pool.query(`INSERT INTO blocked_ips (ip_address, reason) VALUES ($1, $2)`, [ip_address, reason]);
            console.log(`\n🛑 [ACTIVE DEFENSE] IP BANNED: ${ip_address} | Reason: ${reason}`);
        }
    } catch (error) {
         console.error('Ban Error:', error.message);
    }
};

module.exports = { analyzeTraffic };