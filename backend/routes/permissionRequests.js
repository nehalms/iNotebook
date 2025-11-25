const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const PermissionRequest = require('../models/PermissionRequest');
const User = require('../models/User');
const { Email } = require('../Services/Email');
const { getPermissionRequesthtml, getPermissionResponsehtml } = require('../Services/getEmailHtml');

// Create permission request
router.post('/create', fetchuser, async (req, res) => {
    try {
        const { permission } = req.body;
        
        if (!permission) {
            return res.status(400).json({ success: false, error: 'Permission is required' });
        }
        
        const validPermissions = ['notes', 'tasks', 'images', 'games', 'messages', 'news', 'calendar'];
        if (!validPermissions.includes(permission)) {
            return res.status(400).json({ success: false, error: 'Invalid permission' });
        }
        
        // Check if user already has a pending request for this permission
        const existingRequest = await PermissionRequest.findOne({
            user: req.user.id,
            permission: permission,
            status: 'pending'
        }).lean();
        
        if (existingRequest) {
            return res.status(400).json({ success: false, error: 'You already have a pending request for this permission' });
        }
        
        // Create request
        const request = await PermissionRequest.create({
            user: req.user.id,
            permission: permission,
            status: 'pending'
        });
        
        // Get user details
        const user = await User.findById(req.user.id).select('name email').lean();
        
        // Notify admin via email
        try {
            const html = getPermissionRequesthtml(user.name, user.email, permission);
            Email(
                process.env.ADMIN_EMAIL,
                [],
                'New Permission Request',
                '',
                html,
                false,
            );
        } catch (emailError) {
            console.log("Error sending permission request email:", emailError);
        }
        
        res.json({ success: true, msg: 'Permission request created successfully', request });
    } catch (err) {
        console.log("Error creating permission request:", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Get all requests (admin only) - can filter by status
router.get('/all', fetchuser, async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(403).json({ success: false, error: 'Not Authorized' });
            return;
        }
        
        const status = req.query.status; // 'pending', 'approved', 'declined', or undefined for all
        const query = status ? { status } : {};
        
        const requests = await PermissionRequest.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .lean();
        
        res.json({ success: true, requests });
    } catch (err) {
        console.log("Error fetching permission requests:", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Get all pending requests (admin only) - kept for backward compatibility
router.get('/pending', fetchuser, async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(403).json({ success: false, error: 'Not Authorized' });
            return;
        }
        
        const requests = await PermissionRequest.find({ status: 'pending' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .lean();
        
        res.json({ success: true, requests });
    } catch (err) {
        console.log("Error fetching permission requests:", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Approve or decline permission request (admin only)
router.put('/:requestId/respond', fetchuser, async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(403).json({ success: false, error: 'Not Authorized' });
            return;
        }
        
        const { action, comment } = req.body; // action: 'approve' or 'decline'
        
        if (!action || !['approve', 'decline'].includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid action. Must be "approve" or "decline"' });
        }
        
        const request = await PermissionRequest.findById(req.params.requestId)
            .populate('user', 'name email permissions')
            .lean();
        
        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }
        
        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, error: 'Request has already been processed' });
        }
        
        const status = action === 'approve' ? 'approved' : 'declined';
        const adminComment = comment || '';
        
        // Update request
        await PermissionRequest.findByIdAndUpdate(req.params.requestId, {
            status: status,
            adminComment: adminComment,
            updatedAt: new Date()
        });
        
        // If approved, add permission to user (admin will handle this via permissions tab)
        // We just notify the user, admin will grant permission separately
        
        // Notify user via email
        try {
            const html = getPermissionResponsehtml(
                request.user.name,
                request.permission,
                action === 'approve',
                adminComment
            );
            await Email(
                request.user.email,
                [],
                `Permission Request ${action === 'approve' ? 'Approved' : 'Declined'}`,
                '',
                html,
                false,
            );
        } catch (emailError) {
            console.log("Error sending permission response email:", emailError);
            // Continue even if email fails
        }
        
        res.json({ 
            success: true, 
            msg: `Permission request ${action}d successfully`,
            status: status
        });
    } catch (err) {
        console.log("Error responding to permission request:", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Get user's own requests
router.get('/myrequests', fetchuser, async (req, res) => {
    try {
        const requests = await PermissionRequest.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .lean();
        
        res.json({ success: true, requests });
    } catch (err) {
        console.log("Error fetching user requests:", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;

