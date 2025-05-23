const Subscriber = require("../models/Subscriber");

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.send("Subscribed successfully");
  } catch (error) {
    console.error("Error subscribing email:", error.message);
    if (error.code === 11000) {
      return res.status(409).send("This email is already subscribed.");
    }
    res.status(500).send("Failed to subscribe");
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).send("Error retrieving subscribers.");
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Subscriber.findByIdAndDelete(id);
    if (result) {
      res.send("Subscriber deleted successfully.");
    } else {
      res.status(404).send("Subscriber not found.");
    }
  } catch (error) {
    res.status(500).send("Error deleting subscriber.");
  }
};
