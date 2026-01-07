const UserModel = require('../models/user.model');
const { createError } = require('../utils/response');

// Example webhook to confirm deposits
exports.bscDepositConfirmed = async (req, res, next) => {
  try {
    const { transaction_id, busd_amount, token, user_id, address } = req.body;
    if (!transaction_id) return res.status(400).send({ success: false, msg: 'transaction_id required' });
    await UserModel.userBalanceUpdate({ id: transaction_id, busd_amount, token, user_id, address });
    return res.status(200).send({ success: true });
  } catch (error) {
    next(createError('Internal error', 500));
  }
};


