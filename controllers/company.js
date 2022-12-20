import express from "express";
const router = express.Router();


import Auth from './auth.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';

router.get('/get_companies', Auth, async(req, res) => {
    Company.find()
    .then(companies => {
        return res.status(200).json({
            message: companies
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})
router.post('/create_company', Auth, async(req, res) => {
    const user = req.user;
    const {companyName, contant, onlineShopping} = req.body;

    // Check if company exist under the asscociate id
    const company = await Company.find({associateId: user._id});
    
    console.log(company);
    if (company.length > 0)
    {
        return res.status(200).json({
                status: false,
                message: "Company exists"
        })
    }
    else {
        const id = mongoose.Types.ObjectId();
        const _company = new Company({
            _id: id,
            associateId: user._id,
            companyName: companyName,
            contant: contant,
            bio: "",
            onlineShopping: onlineShopping
        });
        _company.save()
        .then(createdCompany => {
            return res.status(200).json({
                status: true,
                message: createdCompany
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })  
        })
    }
})

router.post('/update_company', Auth, async(req, res) => {
    const user = req.user;
    const {companyName, contact, logo, bio, companyId, onlineShopping} = req.body;

    // Check if company exist under the asscociate id
    Company.findById(companyId)
    .then(_company => {
    {
        console.log(_company);
        if (null != _company)
        {
            _company.companyName = companyName;
            _company.contact = contact;
            _company.logo = logo;
            _company.bio = bio;
            _company.onlineShopping = onlineShopping;
            _company.save()
            .then(updatedCompany => {
                return res.status(200).json({
                    status: true,
                    message: updatedCompany
                })
            })
            .catch(err => {
                return res.status(500).json({
                    status: false,
                    message: err.message
                })  
            })
        }
        else {
            return res.status(200).json({
                status: false,
                message: "Current user doesn't have a company"
            })
        }
    }})
    .catch(err => {
        return res.status(200).json({
            status: false,
            message: err.message
        }) 
    })
})

export default router;