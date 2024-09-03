const mongoose = require('mongoose');
const Subscriber = require("../../models/Subscriber");

describe('Subscriber Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('create & save a subscriber successfully', async () => {
    const subscriberData = {
      email: 'subscriber@example.com',
    };
    const validSubscriber = new Subscriber(subscriberData);
    const savedSubscriber = await validSubscriber.save();
    expect(savedSubscriber._id).toBeDefined();
    expect(savedSubscriber.email).toBe(subscriberData.email);
  });

  it('should fail when saving a subscriber without an email', async () => {
    const subscriberWithoutEmail = new Subscriber({});
    let err;
    try {
      await subscriberWithoutEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
