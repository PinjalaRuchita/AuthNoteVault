const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

const fs = require('fs');
const bcrypt = require('bcryptjs');

// Register Endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const users = JSON.parse(fs.readFileSync('users.json'));

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ name, email, password: hashedPassword });

    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    res.json({ message: "User registered successfully" });
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const users = fs.existsSync('users.json') ? JSON.parse(fs.readFileSync('users.json')) : [];

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", name: user.name });
});
