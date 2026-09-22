const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();

// --- طبقات الحماية والتأمين السيبراني ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const securityLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "⚠️ تنبيه أمني: محاولات متكررة مشبوهة، تم تقييد الوصول مؤقتاً."
});
app.use('/secret-portal-x99', securityLimiter);

// --- الاتصال بقاعدة البيانات ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://abooraamoraa_db_user:bgEzB8s6DGleiFKO@cluster0.izdqrn7.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGO_URI)
    .then(() => console.log('🔥 متصل بقاعدة البيانات بنجاح تام لصالح إدارة وتطوير أبو العز العمري'))
    .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// --- ربط مسارات لوحة الإدارة المخفية ---
app.use('/secret-portal-x99/api', adminRoutes);

// مسار لوحة التحكم الرئيسية المخفية والمنعزلة
const SECRET_ADMIN_PATH = '/secret-portal-x99/admin-master-v1';
app.get(SECRET_ADMIN_PATH, (req, res) => {
    const adminToken = req.cookies.admin_auth_token;
    
    if (!adminToken) {
        return res.status(403).send(`
            <html dir="rtl"><head><title>منطقة محظورة - أبو العز العمري</title></head>
            <body style="background:#0f172a; color:#ef4444; font-family:Tahoma; text-align:center; padding-top:100px;">
                <h1>⛔ منطقة محظورة أمنياً</h1>
                <p>هذا المسار عالي السرية ومراقب بالكامل.</p>
            </body></html>
        `);
    }

    res.send(`
        <html dir="rtl"><head><title>لوحة التحكم السيبرانية - إدارة وتطوير أبو العز العمري</title></head>
        <body style="background:#020617; color:#38bdf8; font-family:Tahoma; padding:30px;">
            <h1>🛡️ لوحة التحكم المركزية المخفية - إدارة وتطوير أبو العز العمري</h1>
            <p>النظام محمي ومؤمن بالكامل وجاهز للربط مع إعلانات Adsterra وإدارة الملفات.</p>
        </body></html>
    `);
});

// الواجهة العامة للشركة
app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl"><head><title>إدارة وتطوير أبو العز العمري</title></head>
        <body style="background:#0f172a; color:#fff; font-family:Tahoma; text-align:center; padding-top:100px;">
            <h1>🚀 شركة إدارة وتطوير أبو العز العمري</h1>
            <p>المنظومة الرقمية الخارقة تعمل بأقصى طاقة واستقرار.</p>
        </body></html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر الجبار يعمل الآن على البورت ${PORT}`);
});
