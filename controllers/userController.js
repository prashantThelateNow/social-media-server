const { RegisterUser, userLoginSchema } = require('../models/user');
const { commonAPIResponse } = require('../lib/responseLib');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	/**
	 * Get user registration
	 */
	userRegistration: async (req, res) => {
		try {
			const {
				username: user_name,
				email: user_email,
				password,
			} = req.body;
			const isUserExist = await RegisterUser.exists({
				username: user_name,
			});
			if (isUserExist) {
				throw 'USER_EXIST';
			}
			const isUserEmailExist = await RegisterUser.exists({
				email: user_email,
			});
			if (isUserEmailExist) {
				throw 'USER_EMAIL_EXIST';
			}
			let salt = bcrypt.genSaltSync(10);
			let hash = bcrypt.hashSync(password, salt);
			req.body.password = hash;
			const registeruUserData = new RegisterUser(req.body);
			const registerUserResponse = await registeruUserData.save();
			if (!registerUserResponse) {
				throw 'USER_REGISTRATION_FAILED';
			}
			res.status(200).send(
				commonAPIResponse('User Registered Successfully!', 0, null),
			);
		} catch (error) {
			console.log(error);
			if (error === 'USER_EXIST') {
				res.status(400).send(
					commonAPIResponse('User Already Exists!', 1, null),
				);
			} else if (error === 'USER_EMAIL_EXIST') {
				res.status(400).send(
					commonAPIResponse('Email Already Exists!', 5, null),
				);
			} else if (error === 'USER_REGISTRATION_FAILED') {
				res.status(400).send(
					commonAPIResponse('User Registration Failed!', 4, null),
				);
			} else {
				res.status(500).send(
					commonAPIResponse(
						'Something went wrong! Please try again after sometime',
						3,
						null,
					),
				);
			}
		}
	},

	/**
	 * Check user login
	 */
	userLogin: async (req, res) => {
		try {
			const { username: user_name, password } = req.body;
			const isUserExist = await RegisterUser.findOne({
				username: user_name,
			});
			if (
				!isUserExist ||
				!bcrypt.compareSync(password, isUserExist.password)
			) {
				throw 'INVALID_CRED';
			}
			let userData = {
				userId: isUserExist._id,
				username: isUserExist.username,
				name: isUserExist.name,
				email: isUserExist.email,
				isAdmin: isUserExist.isAdmin,
			};
			const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
				expiresIn: '8h',
			});
			let data = { ...userData, token };
			res.status(200).send(
				commonAPIResponse('User login successfully', 0, data),
			);
		} catch (error) {
			console.log(error);
			if (error === 'INVALID_CRED') {
				res.status(400).send(
					commonAPIResponse('Invalid Username or Password', 1, null),
				);
			} else {
				res.status(500).send(
					commonAPIResponse(
						'Something went wrong! Please try again after sometime',
						3,
						null,
					),
				);
			}
		}
	},

	/**
	 * Count total no. of users
	 */
	countUsers: async (req, res) => {
		try {
			const countUserResponse = await RegisterUser.aggregate([
				{
					$match: {
						createdAt: {
							$gte: new Date(2021, 01, 01),
							$lte: new Date(2021, 12, 31),
						},
						isAdmin: false,
					},
				},
				{
					$count: 'total_no_users',
				},
			]);
			if (!countUserResponse) {
				throw 'COUNT_USER_FAILED';
			}
			if (countUserResponse.length === 0) {
				return res
					.status(200)
					.send(
						commonAPIResponse(
							'No User Found!',
							0,
							countUserResponse,
						),
					);
			}
			res.status(200).send(
				commonAPIResponse('User data found!', 0, countUserResponse),
			);
		} catch (error) {
			console.log(error);
			if (error === 'COUNT_USER_FAILED') {
				res.status(400).send(
					commonAPIResponse('Count user failed!', 1, null),
				);
			} else {
				res.status(500).send(
					commonAPIResponse(
						'Something went wrong! Please try again after sometime',
						3,
						null,
					),
				);
			}
		}
	},
};
