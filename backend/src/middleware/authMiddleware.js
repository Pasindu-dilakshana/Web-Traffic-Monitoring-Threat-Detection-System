const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Check if the request has an "Authorization" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied! No token provided.' });
    }

    // 2. Extract the token (Remove the word "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded user details to the request so the next function can use it
        req.user = decoded; 
        
        // 5. Let them pass!
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token!' });
    }
};

module.exports = verifyToken;