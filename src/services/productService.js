import db from "../models";
import partial from "./partial";

let getCartegoryList = async () => {
  try {
    let data = await db.Cartegory.findAll({
      raw: true,
    });
    partial.recurse(data, 0, "");
    return data;
  } catch (error) {
    console.log(error);
  }
};

let createNewProduct = async (data, dataImage) => {
  try {
    //Tạo product
    let productImg = dataImage.feature_image[0];
    let product = await db.Product.create({
      name: data.name,
      price: data.price,
      feature_image:partial.getBase64(productImg.path),
      content: data.content,
      cartegory_id: data.cartegory_id,
      user_id: "1",
    });

    //Tạo Product_Image
    let image_details = dataImage.image_details;
    let dataProductImg = [];
    if (image_details && image_details.length > 0) {
      for (let i = 0; i < image_details.length; i++) {
        let object = {};
        object.product_id = product.id,
        object.image =partial.getBase64(image_details[i].path);
        dataProductImg.push(object);
      }
    }
    if (dataProductImg && dataProductImg.length > 0) {
      await db.Product_Image.bulkCreate(dataProductImg);
    }

    //Tạo Tag
    let dataTags = data.tags;
    if (typeof dataTags === "string" || dataTags instanceof String) {
      let tag = await db.Tag.findOrCreate({
        where: {
          name: dataTags,
        },
        defaults: {
          name: dataTags,
        },
        raw: false,
      });
      if (tag && tag[0]) {
        await db.Product_Tag.create({
          product_id: product.id,
          tag_id: tag[0].id,
        });
      }
    } else if (dataTags && dataTags.length > 0) {
      for (let i = 0; i < dataTags.length; i++) {
        let tag = await db.Tag.findOrCreate({
          where: {
            name: dataTags[i],
          },
          defaults: {
            name: dataTags[i],
          },
          raw: false,
        });
        if (tag && tag[0]) {
          await db.Product_Tag.create({
            product_id: product.id,
            tag_id: tag[0].id,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllProductManage = async (page) => {
  const { rows, count } = await db.Product.findAndCountAll({
    raw: false,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.Cartegory,
        as: "cartegoryData",
        attributes: ["id", "name"],
      },
    ],
    offset: 10 * (page - 1),
    limit: 10,
    nest: true,
  });
  if (rows && rows.length > 0) {
    rows.map((item) => {
      item.feature_image = `data:image/jpeg;base64,${Buffer.from(
        item.feature_image,
        "base64"
      ).toString("binary")}`;
      return item;
    });
  }
  return {
    count: Math.ceil(count / 10),
    rows,
  };
};

let getAllProduct = async (keyMap, id) => {
  try {
    let data = [];
    if (keyMap === "new") {
      data = await db.Product.findAll({
        raw: false,
        order: [["createdAt", "DESC"]],
        limit: 30,
      });
    }
    if (keyMap === "all") {
      data = await db.Product.findAll({});
    }
    if (keyMap === "cartegory") {
      data = await db.Product.findAll({
        raw: false,
        where: { cartegory_id: id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.Cartegory,
            as: "cartegoryData",
            attributes: ["id", "name"],
          },
        ],
        nest: true,
      });
    }
    if (data && data.length > 0) {
      data.map((item) => {
        item.feature_image = `data:image/jpeg;base64,${Buffer.from(
          item.feature_image,
          "base64"
        ).toString("binary")}`;
        return item;
      });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

let getEditProduct = async (id) => {
  try {
    let dataProduct = await db.Product.findAll({
      where: { id: id },
      include: [
        {
          model: db.Product_Image,
          attributes: ["image"],
          as: "productImageData",
        },
        {
          model: db.Product_Tag,
          attributes: ["tag_id"],
          include: [{ model: db.Tag, attributes: ["name"], as: "tagData" }],
          as: "productTagData",
        },
      ],
      raw: false,
      nest: true,
    });
    return dataProduct;
  } catch (error) {
    console.log(error);
  }
};

let updateProduct = async (id, data, dataImage) => {
  try {
    let product = await db.Product.findOne({
      where: { id: id },
      raw: false,
    });
    if (product) {
      await db.Product_Tag.destroy({
        where: {
          product_id: product.id,
        },
      });
      product.name = data.name;
      product.price = data.price;
      product.content = data.content;
      product.cartegory_id = data.cartegory_id;
      product.user_id = "2";
      if (dataImage) {
        if (dataImage.feature_image) {
          product.feature_image =partial.getBase64(
            dataImage.feature_image[0].path
          );
        }
        if (dataImage.image_details) {
          await db.Product_Image.destroy({
            where: {
              product_id: product.id,
            },
          });
          let image_details = dataImage.image_details;
          let dataProductImg = [];
          if (image_details && image_details.length > 0) {
            for (let i = 0; i < image_details.length; i++) {
              let object = {};
              object.product_id = product.id,
              object.image =partial.getBase64(image_details[i].path);
              dataProductImg.push(object);
            }
          }
          if (dataProductImg && dataProductImg.length > 0) {
            await db.Product_Image.bulkCreate(dataProductImg);
          }
        }
      }

      let dataTags = data.tags;
      if (typeof dataTags === "string" || dataTags instanceof String) {
        let tag = await db.Tag.findOrCreate({
          where: {
            name: dataTags,
          },
          defaults: {
            name: dataTags,
          },
          raw: false,
        });
        if (tag && tag[0]) {
          await db.Product_Tag.create({
            product_id: product.id,
            tag_id: tag[0].id,
          });
        }
      } else if (dataTags && dataTags.length) {
        for (let i = 0; i < dataTags.length; i++) {
          let tag = await db.Tag.findOrCreate({
            where: {
              name: dataTags[i],
            },
            defaults: {
              name: dataTags[i],
            },
            raw: false,
          });
          if (tag && tag[0]) {
            await db.Product_Tag.create({
              product_id: product.id,
              tag_id: tag[0].id,
            });
          }
        }
      }

      await product.save();
    }
  } catch (error) {
    console.log(error);
  }
};

let deleteProduct = async (id) => {
  try {
    let dataProduct = await db.Product.findOne({
      where: { id: id },
      raw: false,
    });
    if (dataProduct) {
      await db.Product_Image.destroy({
        where: {
          product_id: dataProduct.id,
        },
      });
      await db.Product_Tag.destroy({
        where: {
          product_id: dataProduct.id,
        },
      });
      await dataProduct.destroy();
    }
  } catch (error) {
    console.log(error);
  }
};

let getDetailProductShop = async (id) => {
  let data = await db.Product.findOne({
    where: { id: id },
    include: [
      {
        model: db.Product_Image,
        attributes: ["image"],
        as: "productImageData",
      },
      {
        model: db.Product_Tag,
        attributes: ["tag_id"],
        include: [{ model: db.Tag, attributes: ["name"], as: "tagData" }],
        as: "productTagData",
      },
    ],
    raw: false,
    nest: true,
  });
  data.view_count = data.view_count + 1;
  await data.save();
  return data;
};

let getProductOrderById = async (id, limit) => {
  try {
    let data = await db.Product.findAll({
      raw: false,
      order: [[id, "DESC"]],
      limit: limit,
    });
    if (data && data.length > 0) {
      data.map((item) => {
        item.feature_image = `data:image/jpeg;base64,${Buffer.from(
          item.feature_image,
          "base64"
        ).toString("binary")}`;
        return item;
      });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

let getProductToCart = async (cart) => {
  try {
    let products = [];
    let tags = await db.Tag.findAll({});
    if (cart && cart.length > 0) {
      for (let i = 0; i < cart.length; i++) {
        let object = await db.Product.findOne({
          where: { id: cart[i].product_id },
          attributes: {
            exclude: ["content"],
          },
        });
        if (object) {
          object.feature_image = `data:image/jpeg;base64,${Buffer.from(
            object.feature_image,
            "base64"
          ).toString("binary")}`;
          object.quantity = cart[i].quantity;
          for (let j = 0; j < tags.length; j++) {
            if (tags[j].id === +cart[i].tag_id) {
              object.tag_name = tags[j].name;
              object.tag_id = tags[j].id;
            }
          }
          products.push(object);
        }
      }
    }
    return products;
  } catch (error) {
    console.log(error);
  }
};

const getCount = async () => {
  try {
    const countProduct = await db.Product.count();
    const countUser = await db.User.count();
    const countOrder = await db.Customer.count();
    const countOrderDel = await db.Customer.count({
      where: { status: "Đã hủy" },
    });
    return { countOrder: countOrder - countOrderDel, countProduct, countUser };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewProduct,
  getAllProduct,
  getAllProductManage,
  getEditProduct,
  updateProduct,
  deleteProduct,
  getCartegoryList,
  getDetailProductShop,
  getProductOrderById,
  getProductToCart,
  getCount,
};
