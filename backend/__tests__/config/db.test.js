const mongoose = require("mongoose");
const connectDB = require("../../config/db");

jest.mock("mongoose");

describe("Database Connection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to the database successfully", async () => {
    mongoose.connect.mockResolvedValueOnce({});

    console.log = jest.fn();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);
    expect(console.log).toHaveBeenCalledWith("Database connected");
  });

  it("should handle errors during database connection", async () => {
    const errorMessage = "Failed to connect";
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    console.error = jest.fn();

    await connectDB();

    expect(console.error).toHaveBeenCalledWith(errorMessage);
  });
});
