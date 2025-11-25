const SecurityPin = require('../models/SecurityPin');

const checkPinVerification = async (req, res, next) => {
    try {
        // Check if security pin is set for this user
        const securityPin = await SecurityPin.findOne({ user: req.user.id }).select('isPinVerified').lean();
        
        // If pin is not set, allow access
        if (!securityPin) {
            return next();
        }

        // If pin is set, check verification status from database
        if (!securityPin.isPinVerified) {
            return res.status(401).json({ 
                status: 0,
                error: "Security pin verification required",
                requiresPinVerification: true 
            });
        }

        // Pin is set and verified, allow access
        next();
    } catch (error) {
        console.error('Error checking pin verification:', error.message);
        return res.status(500).json({ 
            status: 0,
            error: 'Internal server error' 
        });
    }
};

module.exports = checkPinVerification;

