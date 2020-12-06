const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});
app.use(bodyParser.json());
app.use('/signup',async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    // check if the user signup before
    if (userExists)
        return res.status(403).json({
            error: 'Email is taken!'
        });
    const user = await new User(req.body);
    // hassan every time u need deal with db 
    // write a dummy funtion with explanation 
    // and i will handle it
    await user.save();
    res.status(200).json({ message: 'Signup success! Please login.' });
}
);


app.listen(3000);









/*
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
*/
