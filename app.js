// Añadiremos nuestro servidor, session y uniremos el resto de la aplicación
// const secret = crypto.randomBytes(64).toString('hex');
// const hashedSecret = bcrypt.hashSync(secret, 10);
// implementalas en `crypto/confing.js` y úsalas en secret de session y donde creas que sea necesario. 

const express = require('express'),
jwt = require('jsonwebtoken'),
session = require('express-session'),
routes = require('./routes/users'),
password = require('./crypto/config'),
app = express(),
PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: password.hashedSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

routes.allRoutes(app);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})