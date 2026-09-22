const mongoose = require('mongoose');

const adSettingsSchema = new mongoose.Schema({
    zoneName: { type: String, required: true }, // اسم المساحة الإعلانية (بانر، بوب أب، إلخ)
    adCode: { type: String, required: true },    // كود إعلان Adsterra الخام
    isActive: { type: Boolean, default: true },  // حالة التفعيل (تشغيل/إيقاف من لوحة التحكم)
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdSettings', adSettingsSchema);
