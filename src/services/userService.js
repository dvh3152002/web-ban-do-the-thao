import db from "../models";
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let hashPassword = (password) => {
  try {
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    console.log(error);
  }
};

let handleLogin = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { email: data.email },
    });
    if (user) {
      let check = bcrypt.compareSync(data.password, user.password);
      if (check) {
        delete user.password;
        return user;
      } else {
        return;
      }
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

let getAllRole = async () => {
  try {
    let data = db.Role.findAll({});
    return data;
  } catch (error) {
    console.log(error);
  }
};

let createNewUser = async (data) => {
  let user = db.User.findOne({
    where: { email: data.email },
  });
  if (!user) {
    return false;
  } else {
    await db.User.create({
      name: data.name,
      email: data.email,
      password: hashPassword(data.password),
      role_id: data.role_id ? data.role_id : 1,
    });
    return true;
  }
};

let getAllUser = async (page) => {
  try {
    const { count, rows } = await db.User.findAndCountAll({
      attributes: {
        exclude: ["password"],
      },
      offset: 10 * (page - 1),
      limit: 10,
    });
    return {
      count: Math.ceil(count / 10),
      rows,
    };
  } catch (error) {
    console.log(error);
  }
};

let getEditUser = async (id) => {
  try {
    let data = await db.User.findOne({
      where: { id: id },
      attributes: {
        exclude: ["password"],
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

let updateUser = async (id, data) => {
  try {
    let user = await db.User.findOne({
      where: {
        id: id,
      },
      raw: false,
    });
    if (user) {
      user.name = data.name;
      user.email = data.email;
      user.role_id = data.role_id;
      await user.save();
    } else {
      user = {};
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

let deleteUser = async (id) => {
  try {
    let data = await db.User.findOne({
      where: { id: id },
      raw: false,
    });
    if (data) {
      await data.destroy();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewUser,
  handleLogin,
  getAllUser,
  getEditUser,
  updateUser,
  deleteUser,
  getAllRole,
};
