const CustomerComplete = (sequelize, DataTypes, Sequelize) =>
	sequelize.define("customer_complete", {
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		service: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		task_description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		artisan: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

module.exports = CustomerComplete;
