const PriceRate = require('../../models/PriceRate');

exports.listPrices = async (req, res) => {
  try {
    const prices = await PriceRate.find().sort({ createdAt: -1 });
    res.json({ success: true, prices });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.createPrice = async (req, res) => {
  try {
    const price = await PriceRate.create(req.body);
    res.json({ success: true, price });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const price = await PriceRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, price });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.deletePrice = async (req, res) => {
  try {
    await PriceRate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
