const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ProjectFile = require('../models/ProjectFile');
const AdSettings = require('../models/AdSettings');
const { generateAdminToken, verifyMasterAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// مسار تسجيل دخول المدير السري
router.post('/login-nexus', async (req, res) => {
    try {
        const { username, password } = req.body;
        // افتراض حساب المدير الأول إذا لم يكن مسجلاً
        let admin = await User.findOne({ username, role: 'master_admin' });
        
        if (!admin) {
            return res.status(401).json({ error: "❌ بيانات الدخول غير صحيحة أو ليس لديك صلاحية." });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ كلمة المرور غير صحيحة." });
        }

        const token = generateAdminToken(admin);
        res.cookie('admin_auth_token', token, { httpOnly: true, secure: true, maxAge: 7200000 }); // ساعتان
        res.json({ success: true, message: "🛡️ تم تسجيل الدخول للوحة التحكم السيبرانية بنجاح!", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// مسار سري لإضافة إعلانات Adsterra ديناميكياً من لوحة التحكم
router.post('/ads/update', verifyMasterAdmin, async (req, res) => {
    try {
        const { zoneName, adCode, isActive } = req.body;
        let ad = await AdSettings.findOneAndUpdate(
            { zoneName },
            { adCode, isActive, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: "🚀 تم تحديث وضبط إعلانات Adsterra بنجاح!", ad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
