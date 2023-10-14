module.exports = {
    errorHandlers: (err, req, res, next) => {
        if(err){
            switch (err.name) {
                case "SignInError":
                    res.status(401).json({message: 'Invalid username or password'})
                case "Unauthorized":
                    res.status(401).json({message: 'You dont have access'})
                default:
                    res.status(500).json({message: 'Internal server error'})

            }
        }
    }
}