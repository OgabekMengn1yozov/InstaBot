module.exports = async function Users(DataTypes, sequelize) {
  return sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT },
    username: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
  });
};
