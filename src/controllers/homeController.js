import sliderService from "../services/sliderService";
import cartegoryService from "../services/cartegoryService";
import productService from "../services/productService";
import orderService from "../services/orderService";
import userService from "../services/userService";

const getHomePage = async (req, res) => {
  let sliders = await sliderService.getAllSlider(1);
  let cartegory = await cartegoryService.getAllCartegory("all");
  let dataProductOrderCreate = await productService.getProductOrderById(
    "createdAt",
    4
  );
  let dataProductOrderViewCount = await productService.getProductOrderById(
    "view_count",
    5
  );
  res.render("shop/home", {
    sliders: sliders.rows,
    cartegory,
    dataProductOrderCreate,
    dataProductOrderViewCount,
  });
};

const getCartShopPage = async (req, res) => {
  let products = await productService.getProductToCart(req.session.cart);
  res.render("shop/cartShopPage", {
    products,
  });
};

const getPayShopPage = async (req, res) => {
  let products = await productService.getProductToCart(req.session.cart);
  res.render("shop/payShopPage", { products });
};

const payToCart = async (req, res) => {
  await orderService.payToCart(req.body, req.session.cart, req.cookies.user_id);
  req.session.cart = [];
  res.redirect("back");
};

let getDetailProductShop = async (req, res) => {
  let data = await productService.getDetailProductShop(req.params.id);

  res.render("shop/detailProductShop", { data });
};

let getAllProductByCartegoryId = async (req, res) => {
  let products = await productService.getAllProduct("cartegory", req.params.id);
  res.render("shop/allProductPage", {
    products,
    title: products[0].cartegoryData.name,
  });
};

let getAllProduct = async (req, res) => {
  let products = await productService.getAllProduct("all");
  res.render("shop/allProductPage", { products, title: "Tất cả sản phẩm" });
};

let getAllNewProduct = async (req, res) => {
  let products = await productService.getAllProduct("new");
  res.render("shop/allProductPage", { products, title: "Sản phẩm mới" });
};

let getAdminPage = async (req, res) => {
  let count = await productService.getCount();
  let user = await userService.getEditUser(req.cookies.user_id);
  res.render("manage/adminPage", { count, user });
};

module.exports = {
  getHomePage,
  getCartShopPage,
  getPayShopPage,
  payToCart,
  getDetailProductShop,
  getAllProductByCartegoryId,
  getAllNewProduct,
  getAllProduct,
  getAdminPage,
};
