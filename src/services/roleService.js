import db from "../models";

let getAllRole = async (page) => {
  try {
    const { count, rows } = await db.Role.findAndCountAll({
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

let getAllPermission = () => {
  try {
    let data = db.Permission.findAll({});
    return data;
  } catch (error) {
    console.log(error);
  }
};

let createNewRole = async (data) => {
  let role = await db.Role.create({
    name: data.name,
    display_name: data.display_name,
  });
  let permission = data.permission;
  if (permission) {
    let dataPermission = [];
    permission.map((item) => {
      dataPermission.push({
        role_id: role.id,
        permission_id: item,
      });
    });
    await db.Permission_Role.bulkCreate(dataPermission);
  }
};

let getEditRole = async (id) => {
  try {
    let role = await db.Role.findOne({
      where: { id: id },
    });
    let permission = await db.Permission_Role.findAll({
      where: { role_id: role.id },
    });
    return { role, permission };
  } catch (error) {
    console.log(error);
  }
};

let updateRole = async (id, data) => {
  try {
    let role = await db.Role.findOne({
      where: {
        id: id,
      },
      raw: false,
    });
    if (role) {
      role.name = data.name;
      role.display_name = data.display_name;
      await db.Permission_Role.destroy({
        where: {
          role_id: role.id,
        },
      });
      let permission = data.permission;
      if (permission) {
        let dataPermission = [];
        permission.map((item) => {
          dataPermission.push({
            role_id: role.id,
            permission_id: item,
          });
        });
        await db.Permission_Role.bulkCreate(dataPermission);
      }
      await role.save();
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

let deleteRole = async (id) => {
  try {
    let role = await db.Role.findOne({
      where: { id: id },
      raw: false,
    });
    if (role) {
      await db.Permission_Role.destroy({
        where: {
          role_id: role.id,
        },
      });
      await role.destroy();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewRole,
  getAllPermission,
  getAllRole,
  getEditRole,
  updateRole,
  deleteRole,
  getAllRole,
};
