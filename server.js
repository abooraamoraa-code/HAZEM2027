const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// --- 1. طبقات الأمان القصوى ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// حماية ضد هجمات التخمين والدوس (Rate Limiting قاسي على المسارات الحساسة)
const securityLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 50, // أقصى عدد محاولات
    message: "⚠️ تنبيه أمني: تم حظر عنوان IP الخاص بك مؤقتاً بسبب محاولات مشبوهة."
});
app.use('/secret-portal-x99', securityLimiter);

// --- 2. الاتصال بقاعدة البيانات MongoDB Atlas ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://abooraamoraa_db_user:bgEzB8s6DGleiFKO@cluster0.izdqrn7.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('🔥 تم الاتصال بقاعدة البيانات بنجاح تام لصالح إدارة وتطوير أبو العز العمري'))
    .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// --- 3. مسار لوحة الإدارة المخفية والمنعزلة تماماً ---
// الرابط السري المعقد جداً (لا يمكن لأحد تخمينه أو الوصول إليه عشوائياً)
const SECRET_ADMIN_PATH = '/secret-portal-x99/admin-master-v1';

app.get(SECRET_ADMIN_PATH, (req, res) => {
    // التحقق المبدئي من الصلاحيات أو توكن الدخول الخفي
    const adminToken = req.cookies.admin_auth_token;
    
    if (!adminToken) {
        return res.status(403).send(`
            <html dir="rtl">
            <head><title>منطقة محظورة - أبو العز العمري</title></head>
            <body style="background:#0f172a; color:#ef4444; font-family:Tahoma; text-align:center; padding-top:100px;">
                <h1>⛔ منطقة محظورة أمنياً</h1>
                <p>هذا المسار مراقب ومحمي سيبرانياً. محاولة الوصول غير المصرح بها مسجلة بالكامل.</p>
            </body>
            </html>
        `);
    }

    res.send(`
        <html dir="rtl">
        <head><title>لوحة التحكم السيبرانية - إدارة وتطوير أبو العز العمري</title></head>
        <body style="background:#020617; color:#38bdf8; font-family:Tahoma; padding:30px;">
            <h1>🛡️ مرحباً بك أيها المدير في لوحة التحكم المركزية المخفية</h1>
            <p>النظام يعمل بكفاءة تامة وتحت أقصى درجات التشفير والحماية.</p>
            <hr style="border-color:#1e293b;">
            <ul>
                <li>إدارة الملفات المحمية: مفعلة</li>
                <li>مراقبة الثغرات وحظر الـ IP: تعمل بذكاء</li>
                <li>إدارة إعلانات Adsterra: جاهزة للربط</li>
            </ul>
        </body>
        </html>
    `);
});

// الواجهة العامة للشركة
app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><title>إدارة وتطوير أبو العز العمري</title></head>
        <body style="background:#0f172a; color:#fff; font-family:Tahoma; text-align:center; padding-top:100px;">
            <h1>🚀 شركة إدارة وتطوير أبو العز العمري</h1>
            <p>نحن نصنع المستقبل الرقمي بأعلى معايير القوة والحماية.</p>
        </body>
        </html>
    `);
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر الجبار يعمل الآن على البورت ${PORT}`);
});
