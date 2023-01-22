const mainRouter = require('express').Router();
const appConfig = require('./config/config.app'); 
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const { checkToken } = require('./middlewares/validations/token_validation');

/**
 * All routing initiation
 */

const API_VERSION = appConfig.apiVersion;

// Ecommerce Home API route
mainRouter.get(``, (req, res) => res.status(200).send('Social Media API Home'));

// User API route
mainRouter.use(`${API_VERSION}/users`, userRouter);

// Post API route
mainRouter.use(`${API_VERSION}/posts`, postRouter);

module.exports = mainRouter;