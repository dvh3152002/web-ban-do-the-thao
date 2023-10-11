import userService from "../services/userService";

let getLoginPage = (req, res) => {
  res.render("login");
};

let handleLogin = async (req, res) => {
  try {
    let data = await userService.handleLogin(req.body);
    if (!data) {
      req.session.isError = true;
      res.redirect("login");
    } else {
      if (data.role_id !== 1) {
        req.session.isAdmin = true;
      } else {
        req.session.isAdmin = false;
      }
      req.session.isAuthenticated = true;
      req.session.isError = false;
      res.cookie("user_id", data.id);
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

let postLogout = (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  req.session.isAdmin = false;
  res.clearCookie("user_id");
  res.redirect("/");
};

let getRegisterPage = (req, res) => {
  res.render("register");
};

let postRegister = async (req, res) => {
  try {
    let isError = await userService.createNewUser(req.body);
    if (!isError) {
      req.session.isError = true;
      res.redirect("/register");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};

let getCreateUserPage = async (req, res) => {
  try {
    let data = await userService.getAllRole();
    res.render("manage/user/CreateUser", { data });
  } catch (error) {
    console.log(error);
  }
};

let getUserList = async (req, res) => {
  try {
    const { page } = req.params;
    let user = await userService.getAllUser(page);
    res.render("manage/user/UserList", {
      data: user.rows,
      count: user.count,
      page: page / 1,
    });
  } catch (error) {
    console.log(error);
  }
};

let createNewUser = async (req, res) => {
  try {
    let check = await userService.createNewUser(req.body);
    if (check) {
      res.redirect("/userList/1");
    } else {
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};

let getEditUserPage = async (req, res) => {
  try {
    let role = await userService.getAllRole();
    let user = await userService.getEditUser(req.params.id);
    res.render("manage/user/EditUser", { user, role });
  } catch (error) {
    console.log(error);
  }
};

let updateUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.redirect("/userList/1");
  } catch (error) {
    console.log(error);
  }
};

let deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.body.id);
    res.redirect("/userList/1");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLoginPage,
  handleLogin,
  getCreateUserPage,
  postRegister,
  getUserList,
  createNewUser,
  getEditUserPage,
  updateUser,
  deleteUser,
  getRegisterPage,
  postLogout,
};
