const Company = require('../models/Company');

exports.createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();

    return res.status(201).json({
      message: 'Company created successfully!',
      company: newCompany,
    });
  } catch (error) {
    console.log('Error while creating company: ', error);
    return res.status(500).json({
      message: 'internal server error',
      error: error.message,
    });
  }
};
