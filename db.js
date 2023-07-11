const nano = require("nano");


function connectToDb(dbname) {
    const couchUrl = process.env.COUCH_URL;
    const username = process.env.NAME;
    const password = process.env.PASSWORD;

    const db = nano({
        url: couchUrl,
        requestDefaults: {
            auth: {
                username,
                password
            }
        }
    }).use(dbname);

    db.info((err, body) => {
        if (err) {
            console.error('Помилка підключення до бази даних:', err);
        } else {
            console.log('Підключено до бази даних:', body);
        }
    });

    return db;
}


module.exports = connectToDb;
