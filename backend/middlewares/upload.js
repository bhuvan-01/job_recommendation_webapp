const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create necessary directories
const createUploadDirectories = () => {
  const directories = [
    'uploads/resumes/applications', // Only create this specific directory
  ];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirectories(); 

// Setup Multer storage to always store resumes in uploads/resumes/applications
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'resume') {
      cb(null, 'uploads/resumes/applications/'); // Store resumes in the applications folder
    } else {
      cb(new Error('Invalid field name')); // Handle other field names if necessary
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    console.log(`Storing file as: ${filename}`);
    cb(null, filename);
  },
});

// Check file types for resumes
function checkFileType(file, cb) {
  const resumeTypes = /pdf|doc|docx/;

  const extname = resumeTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = resumeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    console.log('File type not allowed:', file.mimetype, file.originalname);
    return cb(new Error('Error: Only PDF, DOC, and DOCX files are allowed!'));
  }
}

// Multer upload setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
