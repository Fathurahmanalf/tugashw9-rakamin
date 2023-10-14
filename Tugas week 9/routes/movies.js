const express = require('express');
const router =  express.Router();
const pool = require('../config/database')
const { authorize } = require('../middleware/auth')

const app = express();

app.use(authorize);

router.get('/:id', function(req, res, next){
   const id = req.params.id; 
   pool.query(`SELECT * FROM public.movies WHERE id = ${id}`, (err, result) => {
      if (err) {
        next(err)
      } else {
        if (result.rows.length === 0) {
          res.status(404).json({ error: 'Data Not Found' });
        } else {
          res.status(200).json({ message: 'Success', data: result.rows[0] });
        }
      }
   });
 });

//  router.post('/movies', function(req, res){
//     const {id, title, genres, year} = req.body
//     pool.query (`INSERT INTO public.movies (id, title, genres, year)
//     VALUES (${id}, ${title}, ${genres}, ${year};`, 
//     (err, result) => {
//       if (err) {
//          next(err)
//        } else {
//          res.status(201).json({ message: 'Success', data: result.rows });
//        }
//     })   
//  });

router.post('/', (req, res, next) => {
   const { id, title, genres, year } = req.body;
 
   pool.query('INSERT INTO public.movies (id, title, genres, year) VALUES ($1, $2, $3, $4)',
     [id, title, genres, year],
     (err, result) => {
       if (err) {
         console.error('Error:', err);
         next(err)
       } else {
         res.status(201).json({ message: 'Success', data: result.rows });
       }
     }
   );
 });
 
 router.put('/:id', (req, res, next) => {
   const { id } = req.params; // Ambil ID dari parameter URL
   const { title, genres, year } = req.body; // Ambil data yang akan diperbarui dari body request
 
   pool.query('UPDATE public.movies SET title = $1, genres = $2, year = $3 WHERE id = $4',
     [title, genres, year, id],
     (err, result) => {
       if (err) {
         next(err)
       } else {
         if (result.rowCount === 0) {
           res.status(404).json({ error: 'Data Not Found' });
         } else {
           res.status(200).json({ message: 'Success', data: result.rows });
         }
       }
     }
   );
 });
 
 router.delete('/:id', (req, res, next) => {
   const { id } = req.params; // Ambil ID dari parameter URL
 
   pool.query('DELETE FROM public.movies WHERE id = $1', [id], (err, result) => {
     if (err) {
       next(err)
     } else {
       if (result.rowCount === 0) {
         res.status(404).json({ error: 'Data Not Found' });
       } else {
         res.status(200).json({ message: 'Data Has Been Successfully Deleted'}); 
       }
     }
   });
 });
 
 router.get('/', (req, res, next) => {
   const page = parseInt(req.query.page) || 1; // Ambil nomor halaman dari parameter query (default ke 1 jika tidak ada)
   const limit = parseInt(req.query.limit) || 10; // Ambil jumlah data per halaman dari parameter query (default ke 10 jika tidak ada)
   const offset = (page - 1) * limit; // Hitung offset untuk mengambil data dari halaman yang sesuai
 
   pool.query('SELECT * FROM public.movies LIMIT $1 OFFSET $2', [limit, offset], (err, result) => {
     if (err) {
       console.error('Error:', err);
       next(err)
     } else {
       res.status(200).json({ message: 'Success', data: result.rows });
     }
   });
 });
 
 /**
 * @swagger
 * components:
 *   schemas:
 *     Movies:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - year
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movies
 *         title:
 *           type: string
 *           description: The title of movies
 *         genre:
 *           type: string
 *           description: The genre movies
 *         year:
 *           type: integer
 *           description: The movies releases
 *       example:
 *         id: "5ZdfE_azs"
 *         title: "Avenger"
 *         genre: "Action"
 *         year: 2020
 */

 /**
  * @swagger
  * tags:
  *   name: movies
  *   description: Movies API
  * /movies:
  *   post:
  *     summary: Create a new movies
  *     tags: [Movies]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Movies'
  *     responses:
  *       200:
  *         description: Created Movie.
  *         content:
  *            application/json:
  *              schema:
  *                $ref: '#/components/schemas/Movies'
  *       500:
  *         description: Some server error 
  */

  /**
 * @swagger
 * tags:
 *   name: movies
 *   description: Movies API
 * /movies:
 *   get:
 *     summary: Get a list of movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movies'
 *       500:
 *         description: Some server error
 */

  /**
 * @swagger
 * tags:
 *   name: movies
 *   description: Movies API
 * /movies:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movies'
 *     responses:
 *       200:
 *         description: Updated Movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       500:
 *         description: Some server error
 */

  /**
 * @swagger
 * tags:
 *   name: movies
 *   description: Movies API
 * /movies:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted.
 *       500:
 *         description: Some server error
 */


module.exports = router;