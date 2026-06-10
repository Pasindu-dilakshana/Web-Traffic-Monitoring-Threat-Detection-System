exports.checkHealth = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend API is running properly!',
        timestamp: new Date().toISOString()
    });
};