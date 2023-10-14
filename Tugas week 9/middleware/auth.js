const { generateToken, verifyToken } = require('../helpers/jwt')
const pool = require('../config/database');

module.exports = {
    authenticate: async function (req, res, next) {
        try {
            const accesToken = req.headers.access_token

            const decoded = verifyToken(accesToken)

            const checkUser = await pool.query(`SELECT * from public.users WHERE email = '${decoded.email}' AND password = '${decoded.password}' ` );
            
            if(!checkUser) {
                req.role = checkUser.rows[0].role;
                next()
            } else{
                next({name: 'SignInError'})
            }
        } catch (err){
            next(err)
        }
    },
    authorize: async function (req, res, next) {
        try{
            const isEngineer = req.role === 'Engineer'
            
            if(!isEngineer) {
                throw new Error;
            }else {
                next();
            }
        }catch (err){
            next({name: 'Unauthorize'})
        }
    }
}