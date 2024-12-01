const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://KislayK:Kislay1234@kislay.2qruc.mongodb.net/shoesDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema (includes password hash)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    password: { type: String, required: true },
});

// Create the User Model
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, dob, city, state, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            dob,
            city,
            state,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Error signing up user' });
        }
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        res.send({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
