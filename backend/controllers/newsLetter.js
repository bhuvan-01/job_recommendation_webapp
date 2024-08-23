const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email is required');
    }
    try {
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.send('Subscribed successfully');
    } catch (error) {
        console.error('Error subscribing email:', error.message);
        if (error.code === 11000) { // Handle duplicate key error
            return res.status(409).send('This email is already subscribed.');
        }
        res.status(500).send('Failed to subscribe');
    }
};
