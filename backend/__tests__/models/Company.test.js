const mongoose = require("mongoose");
const Company = require("../../models/Company");

describe("Company Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("create & save a company successfully", async () => {
    const companyData = {
      name: "Tech Corp",
      industry: "IT",
      location: "San Francisco",
    };
    const validCompany = new Company(companyData);
    const savedCompany = await validCompany.save();
    expect(savedCompany._id).toBeDefined();
    expect(savedCompany.name).toBe(companyData.name);
    expect(savedCompany.industry).toBe(companyData.industry);
  });

  it("should fail when saving a company without required fields", async () => {
    const companyWithoutRequiredField = new Company({});
    let err;
    try {
      await companyWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
