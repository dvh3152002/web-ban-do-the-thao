import db from "../models";

const checkLogin = (req, res, next) => {
  if (req.cookies.user_id) {
    res.redirect("/");
    return;
  }
  next();
};

const checkLoginCart = (req, res, next) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
    return;
  }
  next();
};

const checkPerformission = async (req, res, next) => {
  if (req.cookies.user_id) {
    let url = req.url.split("/", 3);
    let permission = await db.Permission.findOne({
      where: {
        url_name: url[1],
      },
    });
    if (permission) {
      let user = await db.User.findOne({
        where: { id: req.cookies.user_id },
        attributes: {
          exclude: ["password"],
        },
      });
      let dataRolePermission = await db.Permission_Role.findOne({
        where: {
          role_id: user.role_id,
          permission_id: permission.keyMap,
        },
      });
      if (dataRolePermission) {
        res.locals.lcAuthUser = user;
        next();
      } else {
        res.send("ban ko du quyen truy cap");
      }
    } else {
      res.send("ban ko du quyen truy cap");
    }
  } else {
    res.redirect("/login");
  }
};

module.exports = { checkLogin, checkPerformission, checkLoginCart };
