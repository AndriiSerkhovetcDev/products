const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const AWS = require('aws-sdk');

const upload = multer();

/* GET products listing. */
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch {
        console.error('Error getting products:', err);
        res.status(500).json({ error: 'Error getting products' });
    }
});

// get by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Error getting product' });
    }
});


// create
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;

        if (!name || !price || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const s3 = new AWS.S3();
        const file = req.file;

        if (!file || !['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file format. Only JPEG and PNG are allowed' });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + file.originalname;

        const params = {
            Bucket: 'images-product-list-app',
            Key: fileName,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        };

        // Завантаження файлу на S3
        s3.upload(params, async (err, data) => {
            if (err) {
                console.error('Error uploading file to S3:', err);
                return res.status(500).json({ error: 'Error uploading file to S3' });
            }

            const product = new Product({
                name,
                price,
                description,
                imagePath: data.Location // Отримання URL-адреси файлу на S3
            });

            const validationError = product.validateSync();
            if (validationError) {
                return res.status(400).json({ error: validationError.message });
            }

            await product.save();

            res.json(product);
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// update
router.put('/update/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;

        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

// delete
router.delete('/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const s3 = new AWS.S3();
        const key = product.imagePath.split('/').pop();

        const params = {
            Bucket: 'images-product-list-app',
            Key: key
        };

        // Видалення файлу з S3
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.error('Error deleting file from S3:', err);
                return res.status(500).json({ error: 'Error deleting file from S3' });
            }

            res.json(product);
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;
