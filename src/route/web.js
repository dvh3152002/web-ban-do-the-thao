import express from "express";
import multer from "multer";
import path from "path";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import cartegoryController from "../controllers/cartegoryController";
import productController from "../controllers/productController";
import sliderController from "../controllers/sliderController";
import roleController from "../controllers/roleController";
import orderController from "../controllers/orderController";
import authorization from "../middleware/authorization";

var appRoot = require("app-root-path");

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, appRoot + "/src/public/images/");
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

const imageFilter = function (req, file, callback) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/cart", homeController.getCartShopPage);
  router.get("/payShopPage", homeController.getPayShopPage);
  router.post("/payToCart", homeController.payToCart);
  router.get(
    "/admin",
    authorization.checkLoginCart,
    homeController.getAdminPage
  );

  router.get("/register", userController.getRegisterPage);
  router.post("/register", userController.postRegister);
  router.get("/login", userController.getLoginPage);
  router.post("/login", userController.handleLogin);
  router.post("/logout", userController.postLogout);
  router.get(
    "/userList/:page",
    authorization.checkPerformission,
    userController.getUserList
  );
  router.get(
    "/userCreate",
    authorization.checkPerformission,
    userController.getCreateUserPage
  );
  router.post(
    "/userCreate",
    authorization.checkPerformission,
    userController.createNewUser
  );
  router.get(
    "/userEdit/:id",
    authorization.checkPerformission,
    userController.getEditUserPage
  );
  router.post(
    "/userEdit/:id",
    authorization.checkPerformission,
    userController.updateUser
  );
  router.post(
    "/userDelete",
    authorization.checkPerformission,
    userController.deleteUser
  );

  router.get(
    "/cartegoryList/:page",
    authorization.checkPerformission,
    cartegoryController.getCartegoryList
  );
  router.get(
    "/cartegoryCreate",
    authorization.checkPerformission,
    cartegoryController.getCreateCartegoryPage
  );
  router.post(
    "/cartegoryCreate",
    authorization.checkPerformission,
    cartegoryController.createNewCartegory
  );
  router.get(
    "/cartegoryEdit/:id",
    authorization.checkPerformission,
    cartegoryController.getEditCartegoryPage
  );
  router.post(
    "/cartegoryEdit/:id",
    authorization.checkPerformission,
    cartegoryController.updateCartegory
  );
  router.post(
    "/cartegoryDelete",
    authorization.checkPerformission,
    cartegoryController.deleteCartegory
  );

  router.get(
    "/productList/:page",
    authorization.checkPerformission,
    productController.getProductList
  );
  router.get(
    "/productCreate",
    authorization.checkPerformission,
    productController.getCreateProductPage
  );
  router.post(
    "/productCreate",
    upload.fields([
      { name: "image_details", maxCount: 8 },
      { name: "feature_image", maxCount: 1 },
    ]),
    productController.createNewProduct
  );
  router.get(
    "/productEdit/:id",
    authorization.checkPerformission,
    productController.getEditProductPage
  );
  router.post(
    "/productEdit/:id",
    upload.fields([
      { name: "image_details", maxCount: 8 },
      { name: "feature_image", maxCount: 1 },
    ]),
    productController.updateProduct
  );
  router.post("/productDelete", productController.deleteProduct);

  router.get(
    "/sliderList/:page",
    authorization.checkPerformission,
    sliderController.getSliderList
  );
  router.get(
    "/sliderCreate",
    authorization.checkPerformission,
    sliderController.getCreateSliderPage
  );
  router.post(
    "/sliderDelete",
    authorization.checkPerformission,
    sliderController.deleteSlider
  );
  router.post(
    "/sliderCreate",
    authorization.checkPerformission,
    upload.single("slider_image"),
    sliderController.createNewSlider
  );
  router.get(
    "/sliderEdit/:id",
    authorization.checkPerformission,
    sliderController.getEditSliderPage
  );
  router.post(
    "/sliderEdit/:id",
    authorization.checkPerformission,
    upload.single("slider_image"),
    sliderController.updateSlider
  );

  router.get(
    "/roleList/:page",
    authorization.checkPerformission,
    roleController.getRoleList
  );
  router.get(
    "/roleCreate",
    authorization.checkPerformission,
    roleController.getCreateRolePage
  );
  router.post(
    "/roleCreate",
    authorization.checkPerformission,
    roleController.createNewRole
  );
  router.get(
    "/roleEdit/:id",
    authorization.checkPerformission,
    roleController.getEditRolePage
  );
  router.post(
    "/roleEdit/:id",
    authorization.checkPerformission,
    roleController.updateRole
  );
  router.post(
    "/roleDelete",
    authorization.checkPerformission,
    roleController.deleteRole
  );

  router.post(
    "/addToCart/:id",
    authorization.checkLoginCart,
    orderController.addToCart
  );
  router.get(
    "/updateToCart/:id",
    authorization.checkLoginCart,
    orderController.updateToCart
  );
  router.post(
    "/deleteToCart/:id/:tag_id",
    authorization.checkLoginCart,
    orderController.deleteToCart
  );
  router.post(
    "/updateOrderUser/:id",
    authorization.checkLoginCart,
    orderController.updateOrderUser
  );
  router.get(
    "/OrderList/:page",
    authorization.checkPerformission,
    orderController.getOrderListPage
  );
  router.get(
    "/detailOrderUser/:id",
    authorization.checkLoginCart,
    orderController.getDetailOrderUserPage
  );
  router.get(
    "/orderDetail/:id",
    authorization.checkPerformission,
    orderController.detailOrder
  );
  router.get("/orderUser", orderController.getOrderUserPage);
  router.post(
    "/orderDelete",
    authorization.checkPerformission,
    orderController.deleteOrder
  );
  router.post(
    "/updateStatus/:id",
    authorization.checkPerformission,
    orderController.updateStatus
  );
  router.get("/getAllNewProduct", homeController.getAllNewProduct);
  router.get("/getAllProduct", homeController.getAllProduct);
  router.get(
    "/getProductByCartegoryId/:id",
    homeController.getAllProductByCartegoryId
  );
  router.get("/getDetailProductShop/:id", homeController.getDetailProductShop);

  return app.use("/", router);
};

module.exports = initWebRoutes;
