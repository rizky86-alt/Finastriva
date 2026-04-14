const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');

// Akses untuk Admin dan Super Admin
router.get('/admin-only', verifyToken, checkRole(['admin', 'super_admin']), (req, res) => {
    res.json({ message: 'Welcome Admin or Super Admin', user: req.user });
});

// Hanya untuk Super Admin
router.get('/super-admin-only', verifyToken, checkRole(['super_admin']), (req, res) => {
    res.json({ message: 'Welcome Super Admin! Access Granted', user: req.user });
});

// Contoh mengelola konten (admin & super_admin)
router.post('/manage-content', verifyToken, checkRole(['admin', 'super_admin']), (req, res) => {
    res.json({ message: 'Content updated successfully' });
});

// Contoh mengelola users (HANYA super_admin)
router.delete('/manage-users/:id', verifyToken, checkRole(['super_admin']), (req, res) => {
    res.json({ message: `User ${req.params.id} deleted by Super Admin` });
});

module.exports = router;
