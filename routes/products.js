const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const connectToDb = require('../db');

const dotenv = require('dotenv')
dotenv.config();

const upload = multer();

const dbName = process.env.DB_NAME_PRODUCTS
const bucketName = process.env.BUCKET_NAME;
const db = connectToDb('products');

// Отримання всіх продуктів
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Error getting products' });
    }
});

// Отримання продукту за ідентифікатором
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Error getting product' });
    }
});

// Створення нового продукту
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;

        if (!name || !price || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const file = req.file;
        if (!file || !isValidImageFormat(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file format. Only JPEG, PNG and Webp are allowed' });
        }

        const product = await createProduct(name, price, description, file);
        res.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// Оновлення продукту
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        const file = req.file;

        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (file && !isValidImageFormat(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file format. Only JPEG and PNG are allowed' });
        }

        const updated = await updateProduct(product, updatedProduct, file);
        res.json(updated);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Видалення продукту
router.delete('/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await deleteProduct(product);
        res.json(product);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

// Функція для отримання всіх продуктів
async function getAllProducts() {
    const result = await db.list({ include_docs: true });
    return result.rows.map(row => row.doc);
}

// Функція для отримання продукту за ідентифікатором
async function getProductById(productId) {
    return db.get(productId);
}

// Функція для створення нового продукту
async function createProduct(name, price, description, file) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: getUniqFilename(file),
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype
    };

    const data = await s3.upload(params).promise();

    const product = {
        name,
        price,
        description,
        imagePath: data.Location
    };

    const insertResponse = await db.insert(product);
    if (!insertResponse.ok) {
        throw new Error('Error creating product');
    }

    return product;
}

// Функція для оновлення продукту
async function updateProduct(product, updatedProduct, file) {
    const s3 = new AWS.S3();

    if (file) {
        const params = {
            Bucket: bucketName,
            Key: getUniqFilename(file),
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype
        };

        const data = await s3.upload(params).promise();

        if (product.imagePath) {
            const oldImageKey = product.imagePath.split('/').pop();
            const deleteParams = {
                Bucket: 'images-product-list-app',
                Key: oldImageKey
            };
            await s3.deleteObject(deleteParams).promise();
        }

        updatedProduct.imagePath = data.Location;
    } else {
        updatedProduct.imagePath = product.imagePath;
    }

    await db.insert({ ...updatedProduct, _id: product._id, _rev: product._rev });

    return updatedProduct;
}

// Функція для видалення продукту
async function deleteProduct(product) {
    const s3 = new AWS.S3();

    await db.destroy(product._id, product._rev);

    const key = product.imagePath.split('/').pop();

    const params = {
        Bucket: bucketName,
        Key: key
    };

    await s3.deleteObject(params).promise();
}

// Функція для отримання унікального імені файлу
function getUniqFilename(file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return uniqueSuffix + file.originalname;
}

// Функція для перевірки формату зображення
function isValidImageFormat(mimetype) {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];

    return allowedFormats.includes(mimetype);
}


module.exports = router;
