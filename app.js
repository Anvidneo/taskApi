const express = require('express');
const cors = require('cors');
const login = require('./routes/login');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const db = require('./db/database');

const app = express();

(async ()=> {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Database conected');
    } catch (error) {
        throw new Error(error);
    }
})();

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.use('/login', login);
app.use('/users', users);
app.use('/tasks', tasks);

app.listen(process.env.PORT, () => {
    console.log('API Running in PORT 3001');
});