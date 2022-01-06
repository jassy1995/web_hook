const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	// operatorsAliases: false,
	operatorsAliases: 0,
	logging: false,

	pool: {
		...dbConfig.pool,
	},
});

const Stage = require("./stage.model")(sequelize, DataTypes, Sequelize);
const ArtisanComplete = require("./artisan_complete.model")(
	sequelize,
	DataTypes,
	Sequelize
);
const CustomerComplete = require("./customer_complete.model")(
	sequelize,
	DataTypes,
	Sequelize
);

module.exports = { Stage, ArtisanComplete, CustomerComplete, sequelize };
