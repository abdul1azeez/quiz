// import express from "express";
// import multer from "multer";
// import AdmZip from "adm-zip";
// import fs from "fs";
// import path from "path";

// const app = express();
// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).send("No file uploaded.");

//   const zip = new AdmZip(file.path);
//   const slug = path.basename(file.originalname, ".zip");
//   const extractPath = path.join(__dirname, "public/articles", slug);

//   // Extract files
//   zip.extractAllTo(extractPath, true);

//   fs.unlinkSync(file.path); // cleanup upload
//   res.json({ message: "Article uploaded!", path: `/articles/${slug}/` });
// });

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));


import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure file upload destination
const upload = multer({ dest: 'uploads/' });

// Define paths
const publicPath = path.join(__dirname, 'public');
const articlesPath = path.join(publicPath, 'articles');

// Ensure the base directories exist
fs.mkdirSync(articlesPath, { recursive: true });

const app = express();

// Enable CORS for your React app
// Adjust the origin as needed for production
app.use(cors({
  origin: 'http://localhost:3000', // Or 5173, or your React dev server port
}));

// Serve static files from the 'public' directory
// This will make /articles/my-slug/index.html accessible
app.use(express.static(publicPath));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  
  // Use the slug from the request, or generate one from the filename
  // Using the client-side slug is better as it's already sanitized
  const slug = req.body.slug || path.basename(file.originalname, '.zip');
  
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (file.mimetype !== 'application/zip') {
    // Clean up the invalid file
    fs.unlinkSync(file.path);
    return res.status(400).json({ message: 'Invalid file type. Please upload a .zip file.' });
  }

  const extractPath = path.join(articlesPath, slug);

  try {
    // 1. Extract files
    const zip = new AdmZip(file.path);
    zip.extractAllTo(extractPath, /*overwrite*/ true);

    // 2. Clean up the uploaded .zip file
    fs.unlinkSync(file.path);
    
    // 3. Check if the primary HTML file exists (optional but good)
    // Substack exports usually have an 'index.html' or a file named after the post
    // For simplicity, we'll assume the main file is 'index.html' or similar
    // The path we return is the directory; the browser will look for 'index.html'
    const urlPath = `/articles/${slug}/`;

    res.status(200).json({ 
      message: 'Article uploaded!', 
      urlPath: urlPath 
    });

  } catch (error) {
    console.error('Error processing zip file:', error);
    
    // Clean up the failed upload
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    // Clean up partially extracted folder
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true, force: true });
    }

    res.status(500).json({ message: 'Failed to process zip file. It may be corrupt.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving static files from: ${publicPath}`);
});
