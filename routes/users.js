const userRouter = require('express').Router();
const { userRegistration, userLogin, countUsers } = require('../controllers/userController');
const { registerUserValidation } = require('../middlewares/validations/user.validation');

/**
 * All user routes end points
 */
 userRouter.get(`/`, countUsers);
 userRouter.post(`/`, userRegistration);
 userRouter.post(`/login`, userLogin);



module.exports = userRouter;