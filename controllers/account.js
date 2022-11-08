import express from "express";
import mongoose from 'mongoose';

const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    // fname, lastname, email, password
    const {email, password, firstName, lastName} = req.body;
    const id = mongoose.Types.ObjectId();

    const passCode = randRange(1000, 9999);

    let encryptPass = await bcryptjs.hash(password, 10);

    Account.findOne({email:email})
    .then(async account => {
        if(account)
        {
            return res.status(200).json({
                message: "entered email already used by existed user"  
            })
        }
        else
        {
            Account.create({
                _id: id,
                email: email,
                password: encryptPass,
                firstName: firstName,
                lastName: lastName,
                passcode: passCode
            })
            .then(account => {
                isRegisterSucceed = true;
                return res.status(200).json({
                    userAccount: account
                });
            })
            .catch(err => {
                console.log(err);
                // error: failed creating new user account
                // (one option: new user with exists email address)
                isRegisterSucceed = false;
                return res.status(500).json({
                    error: err
            });
        });
    }
    })
    .catch(err => {
        return res.status(500).json({
            error: err
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
                message: "entered email doesn't exist for any user" 
            });
        }
        else
        {
            if (passCode != account.passcode)
            {
                isVerifySucceed = false;
                return res.status(200).json({
                    message: "entered verify code isn't for current user's account"    
                });
            }
            else
            {
                isVerifySucceed = true;
                account.isVerified = true;
                account.save();
                return res.status(200).json({
                    userAccount : account
                });
            }
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            error: err
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
                        message: "user's account isn't verified"
                    })
                }
                else
                {
                    const data = {account};
                    // login succeed:
                    loginStatusNum = 2;
                    // const userTok = await jsonWebToken.sign(req.body, "A2");
                    userTok = await jwt.sign(data, "KswkWJ3j4ljL2");
                    
                    return res.status(200).json({
                            account: data,
                            userToken: ""
                    });
                } 
            }
            else
            {
                // given password doesn't match user's account, login failed:
                loginStatusNum = 0;
                return res.status(200).json({
                    message: "entered password doesn't match with given email"
                    });
            }
        }
        else
        {
            // user not found, login failed:
            loginStatusNum = 0;
            return res.status(200).json({
                message: "entered email doesn't exist for any user"
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        });
    });
})

//Update account
router.put('/update_account', async(req,res) => {
    // update all data (personal data firstName, lastName, dob, gender, avatar, all contact)
})

//Update password
router.put('/update_password', async(req,res) => {
    // Get current password
    // Get new password
})

router.get('/getOverview', async(req,res) => {
    console.log("a");
})

export default router;