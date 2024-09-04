const mongoose = require("mongoose");
const Application = require("../../models/Application");

describe("Application Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("create & save an application successfully", async () => {
    const applicationData = {
      job: new mongoose.Types.ObjectId(),
      applicant: new mongoose.Types.ObjectId(),
      status: "Pending",
      email: "applicant@example.com",
      phoneNumber: "123-456-7890",
      experience: 3,
      visaStatus: "Valid",
      relocation: "Yes",
      qualification: {
        degreeName: "BSc in Computer Science",
        majorSubject: "Computer Science",
        startDate: new Date(),
      },
    };
    const validApplication = new Application(applicationData);
    const savedApplication = await validApplication.save();
    expect(savedApplication._id).toBeDefined();
    expect(savedApplication.status).toBe(applicationData.status);
    expect(savedApplication.email).toBe(applicationData.email);
  });

  it("should fail when saving an application without required fields", async () => {
    const applicationWithoutRequiredField = new Application({});
    let err;
    try {
      await applicationWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.job).toBeDefined();
  });
});
