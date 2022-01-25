const privateKey = require('../auth/private_key')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
        return res.status(401).json({statut:"error",message })
    }

    const token = authorizationHeader.replace('Bearer ', '')
    let decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
        if (error) {
            const message = `veuillez vous connecter à nouveau.`
            return res.status(401).json({statut:"error", message, data: error })
        }

        const userId = decodedToken.userId;
        next()

       
    })
}