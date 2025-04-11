const axios = require('axios');

axios.post('http://localhost:5000/register', {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
})
.then(response => {
    console.log("✅ Success:", response.data);
})
.catch(error => {
    console.log("❌ Error:", error.response.data);
});
