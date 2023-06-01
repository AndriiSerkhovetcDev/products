const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');


// Встановлюємо налаштування для збереження файлів
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Генеруємо унікальне ім'я для файлу (наприклад, можна використовувати timestamp)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Зберігаємо файл з оригінальним ім'ям та унікальним суфіксом
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Створюємо middleware для завантаження файлів
const upload = multer({ storage: storage });

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

        // Отримуємо шлях до завантаженого файлу
        const imagePath = req.file.path.replace(/\\/g, '/');

        const product = new Product({
            name,
            price,
            description,
            imagePath
        });

        const validationError = product.validateSync();
        if (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        await product.save();

        res.json(product);
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

        res.json(product);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;
