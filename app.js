const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary'); 
const dotenv = require( "dotenv");
dotenv.config()

const app = express();
const port = process.env.port || 3000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Multer Configuration
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Image Upload and Display Example</h1>');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image file');
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    res.status(500).send('Error uploading image');
  }
});

app.get('/image/:public_id', (req, res) => {
  const { public_id } = req.params;
  const imageUrl = cloudinary.url(public_id);

  res.send(`<img src="${imageUrl}" alt="Uploaded Image">`);
});

// Server Start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
