const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Use cookie-parser with a secret key to enable signed cookies
app.use(cookieParser('mySecretKey'));

// Set a signed cookie
app.get('/setsignedcookie', (req, res) => {
    res.cookie('name', 'Sajid');
    res.cookie('session', '123456', { signed: true });
    res.send('Signed cookie has been set');
});

// Read the signed cookie
app.get('/getsignedcookie', (req, res) => {
    const { name } = req.cookies;
    const sessionCookie = req.signedCookies.session;
    if (sessionCookie) {
        res.send(`unsigned cookie Name ${name} and Signed cookie value: ${sessionCookie}`);
    } else {
        res.send('No signed cookie found or cookie has been tampered with');
    }
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
