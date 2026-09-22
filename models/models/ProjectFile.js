const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileKey: { type: String, required: true, unique: true }, // مفتاح سري لتحميل الملف
    fileType: { type: String, required: true }, // تصميم، كود، وسائط
    secureUrl: { type: String, required: true },
    uploadedBy: { type: String, default: 'أبو العز العمري' },
    downloadsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectFile', projectFileSchema);
