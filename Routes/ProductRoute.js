import express from "express";
import { addProducts, delProduct, getAll, getProduct, updateProduct } from "../Controller/ProductController.js";
import { productValidation } from "../Middleware/ProductValidations.js";
import { productImageUpload } from "../Controller/ProductImgCont.js";

const Productrouter = express.Router();

Productrouter.post('/add',productImageUpload.array("productimage",5),productValidation,addProducts)
Productrouter.put('/update/:id',productImageUpload.array("productimage",5),updateProduct)
Productrouter.get('/getall',getAll) // for all
Productrouter.get('/getproduct/:id',getProduct) // for single
Productrouter.delete('/delproduct/:id',delProduct)

export { Productrouter };
