// Aquí estarán todas las rutas

// - GET /: Página de inicio con formulario de inicio de sesión y enlace al panel de control.
// - POST /login: Endpoint para autenticar y generar un token JWT.
// - GET /dashboard: Panel de control accesible solo con un token JWT válido.
// - POST /logout: Endpoint para cerrar sesión y destruir la sesión.

const middlewares = require('../middlewares/authMiddleware'), 
users = require('../data/users');

const allRoutes = (app) => {
    app.get('/', (req, res) => {
        const token = req.session.token;

        const form = `
        <form action='/login' method='post'>
          <label for='username'>Username: </label>
          <input type='text' id='username' name='username'><br>
          <label for='password'>Password: </label>
          <input type='password' id='password' name='password'>
          <button type="submit">Iniciar sesión</button>
        </form>
        <a href='/dashboard'>Dashboard</a>
      `;

      if(token) {
        return res.send(`
            <a href='/dashboard'>Dashboard</a>
            <form action="/logout" method="post"> 
                <button type="submit">Cerrar sesión</button> 
            </form> 
            `)
      } 
     res.send(form);
      
    })

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        const user = users.find(
          (user) => user.username === username && user.password === password
        );
      
        if (user) {
          const token = middlewares.tokenGenerator(user);
          req.session.token = token;
          res.redirect('/dashboard');
        } else {
          res.status(401).json({ mensaje: 'Usuario y/o contraseñas incorrectas' });
        }
      });
      
      app.get('/dashboard', middlewares.verifyToken, (req, res) => {
        const userId = req.user;
        const user = users.find((user) => user.id === userId);

        if (user) {
            res.send(` 
                <h1>Bienvenido, ${user.name}!</h1> 
                <p>ID: ${user.id}</p> 
                <p>Usuario: ${user.username}</p> <br> 
                <form action="/logout" method="post"> 
                <button type="submit">Cerrar sesión</button> 
                </form> <a href="/">home</a> 
                `);
        } else {
            res.status(401).json({ message: 'Usuario no encontrado' });
        }
      });
      
      app.post('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
      });
}

module.exports = {allRoutes};