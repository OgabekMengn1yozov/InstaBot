const { Sequelize, DataTypes } = require("sequelize");
const Users = require("./users");
const Media = require("./media");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URL, {
  // logging: (e) => console.log("SQL", e),
  logging: false,
});

async function postgres() {
  try {
    const db = {};

    db.users = await Users(DataTypes, sequelize);
    db.media = await Media(DataTypes, sequelize);

    await sequelize.sync({ force: false });
    return db;
  } catch (e) {
    console.log("DB ERROR", e);
  }
}

postgres();
module.exports = postgres;
