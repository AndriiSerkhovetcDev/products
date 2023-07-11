const nano = require("nano");
const express = require("express");
const router = express.Router();
const connectToDb = require('../db');
const dbName = process.env.DB_NAME_CONTACTS

const db = connectToDb('contacts');


router.get('/', async (req, res) => {
    try {
        const start = req.query.start;
        const limit = req.query.limit;

        const options = {
            include_docs: true,
            start,
            limit
        };

        const products = await db.list(options);
        const rows = products.rows.map(row => row.doc);
        res.json(rows);
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ error: 'Error getting contacts' });
    }
});


router.post('/add', async (req, res) => {
    try {
        const { firstName, lastName, email, isSelected, isEdit } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const product = {
            firstName,
            lastName,
            email,
            isSelected,
            isEdit
        };

        const insertResponse = await db.insert(product);
        if (!insertResponse.ok) {
            throw new Error('Error creating contact in CouchDB');
        }
        res.json(product);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Error creating contact' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await db.get(contactId);

        if (!contact) {
            return res.status(404).json({ error: 'contact not found' });
        }

        await db.destroy(contact._id, contact._rev);
        res.json(contact);
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Error deleting contact' });
    }
});

module.exports = router;
