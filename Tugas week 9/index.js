const express = require('express');
const app = express();
const pool = require('./config/database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {authenticate} = require('./middleware/auth')

const port = 3001

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const moviesRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');

//Use the Router on the sub route /movies
app.use('/movies', moviesRoutes);
app.use(authenticate);
app.use('/', userRoutes);

const options = {
    definition: {
        openapi: '3.0.0',
        info :{
            title : 'Express With Swagger',
            version : '0.1.0',
            description : 'This is a simple CRUD API application made with Express and documented with Swagger ',
        },
        servers: [
            {
                url : 'http://localhost:3001'
            },
        ],
    },
    apis: ['./routes/*']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.listen(port, () =>{
    console.log(`this port is running on http://localhost:${port}`)
});

