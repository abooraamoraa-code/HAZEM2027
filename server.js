const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();

// --- طبقات الأمان والتأمين السيبراني ---
app.use(helmet({
    contentSecurityPolicy: false // للسماح بتشغيل السكريبتات والإعلانات بسلاسة
}));
app.use(express.json());
app.use(cookieParser());

const securityLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "⚠️ تنبيه أمني: محاولات متكررة مشبوهة، تم تقييد الوصول مؤقتاً."
});
app.use('/secret-portal-x99', securityLimiter);

// --- الاتصال بقاعدة البيانات ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://abooraamoraa_db_user:bgEzB8s6DGleiFKO@cluster0.izdqrn7.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGO_URI)
    .then(() => console.log('🔥 متصل بقاعدة البيانات بنجاح تام لصالح إدارة وتطوير أبو العز العمري'))
    .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// --- تقديم الملفات الثابتة (Frontend) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- ربط مسارات لوحة الإدارة المخفية ---
app.use('/secret-portal-x99/api', adminRoutes);

// مسار صفحة تسجيل الدخول السرية
app.get('/secret-portal-x99/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// مسار لوحة التحكم المركزية المحمية
const SECRET_ADMIN_PATH = '/secret-portal-x99/admin-master-v1';
app.get(SECRET_ADMIN_PATH, (req, res) => {
    const adminToken = req.cookies.admin_auth_token;
    
    if (!adminToken) {
        // إذا لم يكن مسجلاً، نوجهه لصفحة تسجيل الدخول السرية
        return res.redirect('/secret-portal-x99/login');
    }

    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// الواجهة العامة للشركة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر الجبار يعمل الآن بأقصى سرعة على البورت ${PORT}`);
});
