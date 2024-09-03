const Company = require("../models/Company");

exports.createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();

    return res.status(201).json({
      message: "Company created successfully!",
      company: newCompany,
    });
  } catch (error) {
    console.log("Error while creating company: ", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    return res.status(200).json({
      message: "Company updated successfully!",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error while updating company: ", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.toString(),
    });
  }
};


exports.allCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });
    return res.status(200).json({ companies: companies.map((c) => ({ id: c._id, name: c.name })) });
  } catch (error) {
    console.error("Error while fetching companies: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.toString(),
    });
  }
}