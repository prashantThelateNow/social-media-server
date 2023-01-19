const mainRouter = require('express').Router();
const appConfig = require('./config/config.app'); 
const userRouter = require('./routes/users');
const { checkToken } = require('./middlewares/validations/token_validation');

/**
 * All routing initiation
 */

const API_VERSION = appConfig.apiVersion;

// Ecommerce Home API route
mainRouter.get(``, (req, res) => res.status(200).send('Social Media API Home'));

// User API route
mainRouter.use(`${API_VERSION}/users`, userRouter);

module.exports = mainRouter;