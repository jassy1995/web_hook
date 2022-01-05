const Stage = (sequelize, DataTypes) =>
	sequelize.define("stage", {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		menu: {
			type: DataTypes.INTEGER,
		},
		full_name: {
			type: DataTypes.STRING,
		},
		service: {
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING,
		},
		lga: {
			type: DataTypes.STRING,
		},
		address: {
			type: DataTypes.STRING,
		},
		id_card: {
			type: DataTypes.STRING,
		},
		picture: {
			type: DataTypes.STRING,
		},
		location: {
			type: DataTypes.STRING,
		},
		task_description: {
			type: DataTypes.STRING,
		},
		artisan: {
			type: DataTypes.STRING,
		},
	});

module.exports = Stage;
