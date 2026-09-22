const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'abo-elaz-super-secret-key-998877';

// دالة توليد توكن دخول سري للمدير
function generateAdminToken(user) {
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
}

// ميدلوير الحماية للتحقق من الصلاحيات
function verifyMasterAdmin(req, res, next) {
    const token = req.cookies.admin_auth_token || req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ error: "⛔ مرفوض أمنياً: لا يوجد تصريح دخول." });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        if (verified.role !== 'master_admin') {
            return res.status(403).json({ error: "⛔ الصلاحية لا تكفي للوصول لهذه المنطقة." });
        }
        req.adminUser = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: "⚠️ التوكن منتهي الصلاحية أو غير صالح." });
    }
}

module.exports = { generateAdminToken, verifyMasterAdmin };
