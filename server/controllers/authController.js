const AdminUser = require('../models/AdminUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await AdminUser.findOne({ username });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: admin._id,
                username: admin.username,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
};

module.exports = {
    loginAdmin,
};