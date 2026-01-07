const NotificationModel = require('../models/notification.model');
const { createError } = require('../utils/response');

exports.list = async (req, res, next) => {
  try {
    const rows = await NotificationModel.list({ user_id: req.user_id });
    return res.status(200).send({ success: true, data: rows });
  } catch (error) {
    next(createError('Internal error', 500));
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await NotificationModel.markRead({ user_id: req.user_id, id });
    return res.status(200).send({ success: true });
  } catch (error) {
    next(createError('Internal error', 500));
  }
};


