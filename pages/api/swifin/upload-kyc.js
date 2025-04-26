// pages/api/swifin/upload-kyc.js
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = './public/uploads/kyc';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const upload = multer({ storage: storage });

// Setup next-connect middleware
const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Upload error:', error);
    res.status(501).json({ error: `Upload failed: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Accept fields: selfie and idDoc
apiRoute.use(upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'idDoc', maxCount: 1 },
]));

apiRoute.post(async (req, res) => {
  try {
    const selfie = req.files.selfie?.[0]?.filename || null;
    const idDoc = req.files.idDoc?.[0]?.filename || null;

    if (!selfie || !idDoc) {
      return res.status(400).json({ error: 'Missing selfie or ID document.' });
    }

    // Optionally: associate with session user (if logged in)
    // Example: const userId = req.session.user?.id;

    console.log('Selfie uploaded:', selfie);
    console.log('ID Document uploaded:', idDoc);

    // Here you would normally:
    // 1. Store filenames + user info in database
    // 2. Send notification to admin
    // 3. Flag user profile as "Pending KYC Review"

    res.status(200).json({ message: 'KYC documents uploaded successfully.' });
  } catch (error) {
    console.error('KYC Upload error:', error);
    res.status(500).json({ error: 'Server error during KYC upload.' });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;
