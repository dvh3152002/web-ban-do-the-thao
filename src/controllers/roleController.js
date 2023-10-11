import roleService from "../services/roleService";

let getRoleList = async (req, res) => {
  try {
    const { page } = req.params;
    let data = await roleService.getAllRole(page);
    res.render("manage/role/RoleList", {
      data: data.rows,
      count: data.count,
      page: page / 1,
    });
  } catch (error) {
    console.log(error);
  }
};

let getCreateRolePage = async (req, res) => {
  try {
    let data = await roleService.getAllPermission();
    res.render("manage/role/CreateRole", { data });
  } catch (error) {
    console.log(error);
  }
};

let createNewRole = async (req, res) => {
  try {
    await roleService.createNewRole(req.body);
    res.redirect("/roleList/1");
  } catch (error) {
    console.log(error);
  }
};

let getEditRolePage = async (req, res) => {
  try {
    let data = await roleService.getAllPermission();
    let dataRole = await roleService.getEditRole(req.params.id);
    let permission = dataRole.permission;
    data.map((item) => {
      for (let i = 0; i < permission.length; i++) {
        if (item.keyMap === permission[i].permission_id) {
          item.check = "checked";
          break;
        }
      }
      return item;
    });
    res.render("manage/role/EditRole", { role: dataRole.role, data: data });
  } catch (error) {
    console.log(error);
  }
};

let updateRole = async (req, res) => {
  try {
    await roleService.updateRole(req.params.id, req.body);
    res.redirect("/roleList/1");
  } catch (error) {
    console.log(error);
  }
};

let deleteRole = async (req, res) => {
  try {
    await roleService.deleteRole(req.body.id);
    res.redirect("/roleList/1");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getRoleList,
  getCreateRolePage,
  createNewRole,
  getEditRolePage,
  updateRole,
  deleteRole,
};
