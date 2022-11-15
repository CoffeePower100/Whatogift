import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export default (req, res, next) => {

    const header = req.headers['authorization'];

    if(header){
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'KswkWJ3j4ljL2', (error, authdata) => {
            if(error){
                return res.sendStatus(403);    
            }
            else
            {
                Account.findById({_id: authdata.account._id})
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err.message
                    })
                })
            }
        });
    } else {
        return res.sendStatus(403);
    }
}