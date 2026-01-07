const UserModel = require('../models/user.model');
const { createError } = require('../utils/response');

exports.list = async (req, res, next) => {
  try {
    const data = await UserModel.getReferralUsersList({ user_id: req.user_id });
    return res.status(200).send({ success: true, data });
  } catch (error) {
    next(createError('Internal error', 500));
  }
};

exports.earnings = async (_req, res, next) => {
  next(createError('Not implemented', 501));
};


