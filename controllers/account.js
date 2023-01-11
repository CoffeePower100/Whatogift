import express from "express";
import mongoose from 'mongoose';

const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Auth from './auth.js';

function randRange(minNum, maxNum)
{
    return Math.floor(Math.random() * (maxNum - minNum)) + minNum;
}

let isRegisterSucceed = true;
let isVerifySucceed = true;
let loginStatusNum = 2; // 0 - email or user not found
                        // 1 - user didn't verified his / her account
                        // 2 - login succeed

// MODELS
import Account from '../models/account.js';

router.post('/signup', async (req, res) => 
{
    const {email, password, firstName, lastName, uid} = req.body;
    const id = mongoose.Types.ObjectId();

    const passCode = randRange(1000, 9999);

    let encryptPass = await bcryptjs.hash(password, 10);

    Account.findOne({email:email})
    .then(async account => {
        if(account)
        {
            return res.status(200).json({
                status: false,
                message: "entered email already used by existed user"  
            })
        }
        else
        {
            // edit to creating with new Account()
            // instead
            Account.create({
                _id: id,
                uid: uid,
                associateId: id,
                email: email,
                password: encryptPass,
                firstName: firstName,
                lastName: lastName,
                passcode: passCode,
                myFavorites: []
            })
            .then(account => {
                isRegisterSucceed = true;
                return res.status(200).json({
                    status: true,
                    account: account
                });
            })
            .catch(err => {
                console.log(err);
                // error: failed creating new user account
                // (one option: new user with exists email address)
                isRegisterSucceed = false;
                return res.status(500).json({
                    status: false,
                    message: err.message
            });
        });
        }   
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    });
})

router.post('/verify', async(req, res) => {
    const {email, passCode} = req.body;
    Account.findOne({email:email})
    .then(account => {
        // if account with email in request not found:
        if (null == account)
        {
            isVerifySucceed = false;
            return res.status(200).json({
                status: false,
                message: "entered email doesn't exist for any user" 
            });
        }
        else
        {
            if (passCode != account.passcode)
            {
                isVerifySucceed = false;
                return res.status(200).json({
                    status: false,
                    message: "entered verify code isn't for current user's account"    
                });
            }
            else
            {
                isVerifySucceed = true;
                account.isVerified = true;
                account.save();
                return res.status(200).json({
                    status: true,
                    userAccount : account
                });
            }
        }
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    })
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    Account.findOne({email:email})
    .then(async account => {
        // if there's no account with email in request:
        if (account)
        {
            const isPassMatch = await bcryptjs.compare(password, account.password)
            if(isPassMatch) 
            {
                // if found user's account wasn't verified:
                if (false == account.isVerified)
                {
                    // user's account wasn't verified, login failed:
                    loginStatusNum = 1;
                    return res.status(200).json({
                        status: false,
                        message: "user's account isn't verified"
                    })
                }
                else
                {
                    const data = {account};
                    // login succeed:
                    loginStatusNum = 2;
                    // const userTok = await jsonWebToken.sign(req.body, "A2");
                    const userTok = await jwt.sign(data.toJSon, "KswkWJ3j4ljL2");
                    
                    return res.status(200).json({
                            status: true,
                            account: data.account,
                            userToken: userTok
                    });
                } 
            }
            else
            {
                // given password doesn't match user's account, login failed:
                loginStatusNum = 0;
                return res.status(200).json({
                    status: false,
                    message: "entered password doesn't match with given email"
                });
            }
        }
        else
        {
            // user not found, login failed:
            loginStatusNum = 0;
            return res.status(200).json({
                status: false,
                message: "entered email doesn't exist for any user"
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    });
})

//Update account
router.put('/update_account', Auth, async(req,res) => {
    // update all data (personal data firstName, lastName, dob, gender, avatar, all contact)
})

//Update password
router.put('/update_password', Auth, async(req,res) => {
    // Get current password
    // Get new password
})

router.get('/getOverview', Auth, async(req,res) => {
    return res.status(200).json({
        message: `Hello ${req.user.firstName} ${req.user.lastName}`
    });
})


/** 
 * @swagger
 * /api/account/add_product_to_favorites:
 *  post:
 *   summary: Add given product to a user's favorite products.
 *   description: Use this endpoint to add product to favorites.
 *   tags: [Account]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       properties:
 *        favoriteProductId:
 *         type: string
 *         example: 63a21cb598f0cf5048553de9
 *   responses:
 *    200:
 *     description: Product added to favorites (if not already added as a favorite).
 *    500:
 *     description: Failure in creating product
*/
router.post('/add_product_to_favorites', Auth, async(req, res) => {
    const accountId = req.user._id;
    const newFavProdId = new mongoose.Types.ObjectId(req.body.favoriteProductId);

    Account.findById(accountId)
    .then (wantedAccount => {
        if (wantedAccount)
        {
            if (!wantedAccount.myFavorites.includes({_id: newFavProdId}))
            {

                wantedAccount.myFavorites.push(newFavProdId);
                
            }

            wantedAccount.save()
            .then(async (updatedAccount) => {
                const userTok = await jwt.sign(updatedAccount.toJSON(), "KswkWJ3j4ljL2");
                return res.status(200).json({
                    status: true,
                    account: updatedAccount,
                    userTok: userTok
                })
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: error.message
                })  
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    })
})


/** 
 * @swagger
 * /api/account/delete_product_from_favorites:
 *  post:
 *   summary: Delete given product from user's favorite products.
 *   description: Use this endpoint to delete product from favorites.
 *   tags: [Account]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       properties:
 *        favoriteProductId:
 *         type: string
 *         example: 63a21cb598f0cf5048553de9
 *   responses:
 *    200:
 *     description: Product was deleted from favorites (if product was in favorites existed before).
 *    500:
 *     description: Failure in creating product
*/
router.post('/delete_product_from_favorites', Auth, async(req, res) => {
    const accountId = req.user._id;
    const existFavProdId = new mongoose.Types.ObjectId(req.body.favoriteProductId);
    Account.findById(accountId)
    .then (wantedAccount => {
        if (wantedAccount)
        {
            console.log(wantedAccount.myFavorites.length);
                const favProdIdIn = wantedAccount.myFavorites.indexOf({_id: existFavProdId});
                // if found current product:
                if (-1 != favProdIdIn)
                {
                    wantedAccount.myFavorites.splice(index, 1);
                }
                console.log(favProdIdIn)
                console.log(wantedAccount.myFavorites.length);

            wantedAccount.save()
            .then(async (updatedAccount) => {
                const userTok = await jwt.sign(updatedAccount.toJSON(), "KswkWJ3j4ljL2");
                return res.status(200).json({
                    status: true,
                    account: updatedAccount,
                    userTok: userTok
                })
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: error.message
                })  
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    })
})
export default router;