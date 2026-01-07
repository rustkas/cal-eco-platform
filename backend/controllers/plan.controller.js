const UserModel = require('../models/user.model');
const { createError } = require('../utils/response');

exports.list = async (_req, res, next) => {
  try {
    const data = await UserModel.getPlanDetails();
    return res.status(200).send({ success: true, data });
  } catch (error) {
    next(createError('Internal error', 500));
  }
};

exports.detail = async (_req, res, next) => {
  next(createError('Not implemented', 501));
};


