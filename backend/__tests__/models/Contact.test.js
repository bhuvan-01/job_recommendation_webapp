const mongoose = require('mongoose');
const Contact = require('../../models/Contact');

describe('Contact Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('create & save a contact successfully', async () => {
    const contactData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '987-654-3210',
      message: 'I am interested in your services.',
    };
    const validContact = new Contact(contactData);
    const savedContact = await validContact.save();
    expect(savedContact._id).toBeDefined();
    expect(savedContact.email).toBe(contactData.email);
    expect(savedContact.message).toBe(contactData.message);
  });

  it('should fail when saving a contact without required fields', async () => {
    const contactWithoutRequiredField = new Contact({});
    let err;
    try {
      await contactWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
