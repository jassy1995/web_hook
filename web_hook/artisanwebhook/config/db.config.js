require("dotenv").config();
const { NODE_ENV, DB_USER, DB_HOST, DB_PASSWORD, DB } = process.env;
const prod = NODE_ENV === "production";

const dbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "babatunde85",
  DB: "testdb",
  dialect: "mysql",

  // Production Mode
  ...(prod && {
    USER: DB_USER,
    HOST: DB_HOST,
    PASSWORD: DB_PASSWORD,
    DB: DB,
  }),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = dbConfig;
