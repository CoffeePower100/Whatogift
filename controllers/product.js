import express from "express";
import mongoose from 'mongoose';

const router = express.Router();

import Auth from './auth.js';

import Product from '../models/product.js';
import Brand from '../models/brand.js';
import Category from '../models/category.js';

/**
 * @swagger
 *  /api/product/get_all_categories:
 *  get:
 *   summary: Return a list of all categories
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: This is the list of all categories
 *     content: 
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Error was found
 */
router.get('/get_all_categories', async(req, res) => {
    Category.find()
    .then(categories => {
        return res.status(200).json({
            message: categories
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

router.post('/create_new_category', Auth, async(req, res) => {
    const {categoryName} = req.body;

    // Check if category exists
    const category = await Category.find({categoryName: categoryName});
    
    console.log(category);
    if (category.length > 0)
    {
        return res.status(200).json({
                status: false,
                message: "Category exists"
        })
    }
    else {
        const id = mongoose.Types.ObjectId();
        const _category = new Category({
            _id: id,
            categoryName: categoryName
        });
        _category.save()
        .then(createdCategory => {
            return res.status(200).json({
                status: true,
                message: createdCategory
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

router.delete('/delete_category', Auth, async(req,res) => {

})

/**
 * @swagger
 *  /api/product/get_all_brands:
 *  get:
 *   summary: Return a list of all brands
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: This is the list of all brands
 *     content: 
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Error was found
 */
router.get('/get_all_brands', async(req, res) => {
    Brand.find()
    .then(brands => {
        return res.status(200).json({
            message: brands
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

/**
 * @swagger
 *  /api/product/get_brand_by_id/{id}:
 *  get:
 *   summary: Get brand name by id
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Brand success
 *    500:
 *     description: Error was found
 */
router.get('/get_brand_by_id/:id', async(req, res) => {
    Brand.findById(req.params.id)
    .then(brand => {
        return res.status(200).json({
            message: brand
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

/**
 * @swagger
 * definitions:
 *  Brand:
 *   type: object
 *   properties:
 *    brandName:
 *     type: string
 *     description: The name of the brand
 *     example: Puma
 *    brandLogo:
 *     type: string
 *     description: Copy and paste image url
 *     example: puma_log.png
 */

/** 
 * @swagger
 * /api/product/create_new_brand:
 *  post:
 *   summary: Create new brand
 *   description: Use this endpoint to create a new brand
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Brand'
 *   responses:
 *    200:
 *     description: Brand created
 *    500:
 *     description: Failure in created brand
*/
router.post('/create_new_brand', Auth, async(req, res) => {
    const {brandName, brandLogo} = req.body;
    const id = mongoose.Types.ObjectId();
    const _brand = new Brand({
        _id: id,
        brandName:brandName,
        brandLogo: brandLogo
    });
    _brand.save()
    .then(createdBrand => {
        return res.status(200).json({
            message: createdBrand
        })
    })
    .catch(error => {
        return res.status(500).json({message: error.message})
    })
})

router.delete('/delete_brand', Auth, async(req, res) => {

})

/**
 * @swagger
 *  /api/product/get_all_products:
 *  get:
 *   summary: Return a list of all products
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: This is the list of all products
 *     content: 
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Error was found
 */
router.get('/get_all_products', async(req, res) => {
    Product.find()
    .then(products => {
        return res.status(200).json({
            message: products
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

/** 
 * @swagger
 * /api/product/create_new_product:
 *  post:
 *   summary: Create new product
 *   description: Use this endpoint to create a new product
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       properties:
 *        productName:
 *         type: string
 *         example: "Puma BVB Shirt" 
 *        companyId:
 *         type: string
 *         example: "6385cdc496d4f8141dbc925f"
 *        categoryId:
 *         type: string
 *         example: "6385cd1096d4f8141dbc9251" 
 *        brandId:
 *         type: string
 *         example: "6385cce896d4f8141dbc924b"
 *        productImage:
 *         type: string
 *         example: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1500,h_1500/global/765883/01/fnd/GLOBAL/fmt/png/%D7%91%D7%95%D7%A8%D7%95%D7%A1%D7%99%D7%94-%D7%93%D7%95%D7%A8%D7%98%D7%9E%D7%95%D7%A0%D7%93-%D7%91%D7%99%D7%AA-22/23-%D7%94%D7%A2%D7%AA%D7%A7-%D7%92'%D7%A8%D7%96%D7%99-%D7%92%D7%91%D7%A8%D7%99%D7%9D"        
 *        productPrice:
 *         type: number
 *         example: 389.00         
 *        productDescription:
 *         type: string
 *         example: "This is Puma's BVB football club shirt, for men."
 *        unitInStock: 
 *         type: number
 *         example: 56 
 *        minimumAge:
 *         type: number
 *         example: 12
 *        maximumAge:
 *         type: number
 *         example: 40
 *        genderTarget:
 *         type: string
 *         example: "male"
 *        tags:
 *         type: array
 *         example: ["sports", "football", "clothes"]
 *        hasOnlinePurchase:
 *         type: boolean
 *         example: true
 *   responses:
 *    200:
 *     description: Product created
 *    500:
 *     description: Failure in creating product
*/
router.post('/create_new_product', Auth, async(req, res) => {
    let i = 0;
    
    const id = mongoose.Types.ObjectId();
    const { companyId, categoryId, brandId,
        productName, productPrice, productDescription,
        unitInStock, productImage, minimumAge, maximumAge,
        genderTarget, tags, hasOnlinePurchase} = req.body;
    
    const gender = {"female" : false, "male": false};
    
    if (genderTarget in gender)
    {
        gender[genderTarget] = true;
    }
    else
    {
        // Unisex: product will be for all genders:
        Object.keys(gender).forEach(currGender => {gender[currGender] = true;});
    }

    /*
    order given tags by user
    in objects, per tag:
    */
    for ( ; i < tags.length; i++)
    {
        tags[i] = {currTag: tags[i]};
    }

    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: [{imageSource: productImage}],
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: [],
        minimumAge: minimumAge,
        maximumAge: maximumAge,
        gender: gender,
        tags: tags,
        hasOnlinePurchase: hasOnlinePurchase
    });
    _product.save()
    .then(product_created => {
        return res.status(200).json({
            message: product_created
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

router.delete('/delete_product', Auth, async(req, res) => {

})


router.post('/find_suited_gift', async (req, res) => {
    let i = 0;
    let j = 0;
    let isTagFound = false; 
    const {relationLevel, interests, events, minmiumPrice, 
        maximumPrice, age, genderTarget} = req.body;

    const checkedTags = [];
    const eventsTags = 
    {
        "birthday": ["sports", "clothes", "clocks", "gadgets"],
        "wedding anniversary": ["flowers", "jewelry", "clocks"]
    };

    switch (relationLevel) {
        case 1:
            minmiumPrice = 150;
            break;
        
        case 2:
            minmiumPrice = 120;
            break;
        case 3:
            minmiumPrice = 100;
            break;
        case 4:
            minimumPrice = 70;
            break;
        case 5:
            minmiumPrice = 40;
            break;
        default:
            // do not set minimum price for gift.
    }

    if ([] != interests)
    {
        checkedTags += interests;
    }

    if ([] != events)
    {
        for ( ; i < events.length; i++)
        {
            if (events[i] in eventsTags)
            {
                checkedTags += eventsTags[events[i]];
            }
        }
    }

    Product.find().populate("companyId", "contact")
    .then(products => {
        
        for ( ; j < products.length; j++)
        {
            /*
            if ((minimumPrice >= 0) && (products[j].productPrice >= minmiumPrice))
            {
                if ((maximumPrice >= 0) && (products[j].productPrice < maximumPrice))
                {
                
                }
            }
            
            // else
            products.remove(products[i]);
            */
        }
        return res.status(200).json({
            status: true,
            message: products
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    })
})

export default router;
