module.exports = async function Media(DataTypes, sequelize) {
  return sequelize.define("media", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    results_number: { type: DataTypes.INTEGER },
    file_id: { type: DataTypes.ARRAY(DataTypes.STRING) },
    link: { type: DataTypes.TEXT },
  });
};
