const axios = require('axios');

axios.post('http://localhost:5000/login', {
    email: "test@example.com",
    password: "password123"
})
.then(response => {
    console.log("✅ Login Success:", response.data);
})
.catch(error => {
    console.log("❌ Login Error:", error.response.data);
});
