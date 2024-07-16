const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  industry: { type: String },
  location: { type: String },
  website: { type: String },
  overview: { type: String },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
