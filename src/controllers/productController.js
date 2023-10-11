import productService from "../services/productService";

let getProductList = async (req, res) => {
  try {
    const { page } = req.params;
    let data = await productService.getAllProductManage(page);
    res.render("manage/product/ProductList", {
      data: data.rows,
      count: data.count,
      page: page / 1,
    });
  } catch (error) {
    console.log(error);
  }
};

let getCreateProductPage = async (req, res) => {
  try {
    let data = await productService.getCartegoryList();
    res.render("manage/product/CreateProduct", { data });
  } catch (error) {
    console.log(error);
  }
};

let createNewProduct = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files.feature_image) {
      return res.send("Bạn chưa chọn ảnh đại diện");
    } else if (!req.files.image_details) {
      return res.send("Bạn chưa chọn ảnh chi tiết");
    }
    await productService.createNewProduct(req.body, req.files);
    res.redirect("/productList/1");
  } catch (error) {
    console.log(error);
  }
};

let getEditProductPage = async (req, res) => {
  try {
    let data = await productService.getCartegoryList();
    let dataProduct = await productService.getEditProduct(req.params.id);
    res.render("manage/product/EditProduct", {
      dataProduct: dataProduct[0],
      data,
      productImageData: dataProduct[0].productImageData,
      productTagData: dataProduct[0].productTagData,
    });
  } catch (error) {
    console.log(error);
  }
};

let updateProduct = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    await productService.updateProduct(req.params.id, req.body, req.files);
    res.redirect("/productList/1");
  } catch (error) {
    console.log(error);
  }
};

let deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.body.id);
    res.redirect("/productList/1");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getProductList,
  getCreateProductPage,
  createNewProduct,
  getEditProductPage,
  updateProduct,
  deleteProduct,
};
