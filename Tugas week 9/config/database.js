const dotenv = require('dotenv');
dotenv.config();

const {DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env

const Pool = require('pg').Pool;
const pool = new Pool({
    user : DB_USER,
    host : DB_HOST,
    database : DB_NAME,
    password : DB_PASSWORD,
    port : DB_PORT
});

// untuk menampilkan apakah database connect atau tidak
pool.connect((err, res) => {
    if (err){
        console.error('connection error', err.stack);
    }else{
        console.log('database connected successfully');
    }
})
module.exports = pool;
