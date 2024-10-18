import fs from "fs";
import { v4 as uuidv4 } from "uuid";
const productPath = "./Model/Users/Products.json";

const addProducts = async (req, res) => {
  const userId = uuidv4();
  try {
    const { title, price, desc, size, category, stock } = req.body;
    const product = {
      title,
      price,
      desc,
      size,
      category,
      stock,
      userId,
    };

    console.log("manyphoto", req.files);

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => {
        const imagePath = file.path.replace(/^public[\\/]/, "");
        return `http://localhost:3000/${imagePath}`;
      });

      product.imgPath = imagePaths;
      // console.log(imagePaths);
    }

    if (!fs.existsSync(productPath)) {
      fs.writeFileSync(productPath, JSON.stringify([]));
    }

    const productData = JSON.parse(fs.readFileSync(productPath));

    const titleExist = productData.some(
      (existingTitle) => existingTitle.title === title
    );
    if (titleExist) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Failed to delete the image file:", err);
          }
        });
      }
      return res.status(400).json({
        message: "Product already listed please Try another",
        status: false,
      });
    }
    console.log("product", product);
    productData.push(product);
    const jsonData = JSON.stringify(productData);
    const path = productPath;

    fs.writeFileSync(path, jsonData);
    res.status(201).json({
      message: "Product Saved successfully.",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Occur: ${error}`,
      status: false,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const productData = JSON.parse(fs.readFileSync(productPath));

    const productFind = productData.find((details) => details.userId === id);
    if (!productFind) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => {
        const imagePath = file.path.replace(/^public[\\/]/, "");
        return `http://localhost:3000/${imagePath}`;
      });

      productFind.imgPath = imagePaths;
      // console.log(imagePaths);
    }

    // console.log("sss", productFind);
    const { title, price, desc, stock,size } = req.body;

    productFind.title = title || productFind.title; // Update only if provided
    productFind.price = price || productFind.price;
    productFind.desc = desc || productFind.desc;
    productFind.stock = stock || productFind.stock;
    productFind.size = size || productFind.size;
    const jsonData = JSON.stringify(productData, null, 2);

    // console.log("after", jsonData);
    fs.writeFile(productPath, jsonData, (err) => err && console.error(err));
    res.status(200).json({
      message: "Product Data Updated Succesfully",
      success: true,
      data: productData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `error,,:${error}` });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const productData = JSON.parse(fs.readFileSync(productPath));

    const productFind = productData.find((details) => details.userId === id);
    if (!productFind) {
      return res.status(404).json({
        message: "Product not found with this id",
        success: false,
      });
    }
    res.status(200).json(productFind);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

const delProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const productData = JSON.parse(fs.readFileSync(productPath));

    const productIndex = productData.findIndex(
      (details) => details.userId === id
    );
    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found with this id",
        success: false,
      });
    }

    const deletedProduct = productData.splice(productIndex, 1); // This removes the product from the array
    console.log(deletedProduct);
    const jsonData = JSON.stringify(productData, null, 2);
    fs.writeFileSync(productPath, jsonData);
    return res.status(200).json({
      message: "User Deleted Succesfully",
      success: true,
      delUser: deletedProduct,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

const getAll = async (req, res) => {
  try {
    const productData = JSON.parse(fs.readFileSync(productPath));
    // console.log(productData);
    return res.status(200).json({
      message: "Products Fetch Succesfully",
      success: true,
      Products: productData,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Error: ${error}`,
    });
  }
};

export { addProducts, updateProduct, getProduct, delProduct, getAll };
