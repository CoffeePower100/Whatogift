import express from "express";
const router = express.Router();

router.get('/', async(request, response) => {
    return response.status(200).json({
        message: "Hello from whatogift"
    });
})

export default router;