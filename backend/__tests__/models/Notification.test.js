const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

describe('Notification Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('create & save a notification successfully', async () => {
    const notificationData = {
      recipient: new mongoose.Types.ObjectId(),
      message: 'You have a new message.',
      type: 'info',
    };
    const validNotification = new Notification(notificationData);
    const savedNotification = await validNotification.save();
    expect(savedNotification._id).toBeDefined();
    expect(savedNotification.type).toBe(notificationData.type);
    expect(savedNotification.message).toBe(notificationData.message);
  });

  it('should fail when saving a notification without required fields', async () => {
    const notificationWithoutRequiredField = new Notification({});
    let err;
    try {
      await notificationWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.recipient).toBeDefined();
  });
});
