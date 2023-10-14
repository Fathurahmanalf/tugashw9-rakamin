const express = require('express');
const router =  express.Router();
const pool = require('../config/database');
const {generateToken} = require('../helpers/jwt');
const { authorize } = require('../middleware/auth')

const app = express();
app.use(authorize);

router.get('/user', (req, res, next) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const offset = (page - 1) * limit; 

  pool.query('SELECT * FROM public.users LIMIT $1 OFFSET $2', [limit, offset], (err, result) => {
    if (err) {
      next(err)
    } else {
      res.status(200).json({ message: 'Success', data: result.rows });
    }
  });
});

router.get('/login',  (req, res, next) => {
    const {email, password} = req.body

    pool.query(`SELECT * FROM public.users WHERE email = '${email}' AND password = '${password}'`, (err, result) => {
      if (err) {
        console.error('Error:', err);
        next(err)
      } else {
        const {email, password} = result.rows[0]

        const generateUserToken = generateToken({email, password})
        res.status(201).json({ access_token: generateUserToken, result: result.rows[0]});
      }
    }
  );
})

router.post('/register', (req, res, next) => {
  const { email, password } = req.body;

  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password terlalu pendek' });
  }

  pool.query(
    'INSERT INTO public.users (id, email, gender, role, password) VALUES ($1, $2, $3, $4, $5)',
    [id, email, gender, role, password],
    (err, result) => {
      if (err) {
        next(err);
      } else {
        res.status(201).json({ message: 'Registrasi berhasil' });
      }
    }
  );
});







// router.get('/', (req, res) => {
//   const { email, password } = req.body;

//   pool.query(
//     'SELECT * FROM public.users WHERE email = $1 AND password = $2',
//     [email, password],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         if (result.rows.length === 0) {
//           res.status(401).json({ error: 'Unauthorized' });
//         } else {
//           res.status(200).json({ message: 'Success', data: result.rows });
//         }
//       }
//     }
//   );
// });



module.exports = router;
