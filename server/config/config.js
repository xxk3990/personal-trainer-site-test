const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  "development": {
    "username": null,
    "password": null,
    "database": "personal_trainer_site",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": process.env.RDS_PASSWORD,
    "database": "personal_trainer_site",
    "host": "personal-trainer-site.cg6tsyf9mgr3.us-east-2.rds.amazonaws.com",
    "dialect": "postgres"
  }
}