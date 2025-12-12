import express from 'express';
import path from 'path';
import url from 'url';
import { model } from './model/model.mjs';
import { Usuario } from './model/usuario.mjs';
import mongoose from 'mongoose';
import passport from 'passport'; // [cite: 27]
import jwt from 'jsonwebtoken'; // [cite: 29]
import bcrypt from 'bcrypt'; // [cite: 30]
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'; // [cite: 28]

// --- CONEXIÓN DB ---
async function connect() {
  var uri = 'mongodb://127.0.0.1/libreria';
  mongoose.Promise = global.Promise;
  var db = mongoose.connection;
  // ... (logs de conexión igual que antes)
  db.on('error', function (err) { console.error('Error ', err.message); });
  return await mongoose.connect(uri);
}
await connect();

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
const SECRET_KEY = "tu_clave_secreta_aqui"; // Definir clave secreta

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN PASSPORT [cite: 49-67] ---
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    },
    async function (jwtPayload, cb) {
      try {
        let user = await Usuario.findById(jwtPayload.id);
        if (user) {
            return cb(null, user);
        } else {
            return cb(null, false);
        }
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);
app.use(passport.initialize());

// --- RUTAS PÚBLICAS ---

app.get('/api/libros', async function (req, res, next) {
  res.json(await model.getLibros());
})

// Registro
app.post('/api/usuarios', async function (req, res, next) {
    try {
      let usuario = await model.addUsuario(req.body);
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: err.message })
    }
})

// Autenticación (Login) [cite: 78-88]
app.post('/api/autenticar', async function (req, res, next) {
    try {
        // 1. Verificar si el usuario existe
        const userExists = await Usuario.findOne({ email: req.body.email });
        if (!userExists) return res.status(400).json({ message: 'El usuario no existe' });

        // 2. Verificar contraseña con bcrypt
        let ok = await bcrypt.compare(req.body.password, userExists.password);
        if (!ok) return res.status(400).json({ message: 'Contraseña incorrecta' });

        // 3. Crear Token (Expiración 1 minuto como pide la actividad )
        const accessToken = jwt.sign({ id: userExists._id }, SECRET_KEY, { expiresIn: '60s' });
        
        // Devolver token
        return res.status(200).json({ token: accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// --- RUTAS PRIVADAS (Protegidas con JWT) [cite: 90-102] ---

// Obtener Usuario Actual (usando el token)
app.get('/api/usuarios/actual', 
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    try {
        let usuario = req.user;
        if (!usuario) res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Modificar Usuario
app.put('/api/usuarios/:id',
  passport.authenticate('jwt', { session: false }), // Protección
  async function (req, res, next) {
    try {
      let obj = req.body;
      // Asegurar que el usuario solo modifique su propio ID (seguridad extra)
      obj._id = req.params.id; 
      
      // En un caso real, validar que req.user._id == req.params.id

      let usuario = await model.updateUsuario(obj);
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message })
    }
  });

app.get('/api/usuarios/:id',
    passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
      try {
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) res.status(404).json({ message: 'Usuario no encontrado' })
        res.json(usuario);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

// --- ARCHIVOS ESTÁTICOS ---
app.use('/', express.static(path.join(STATIC_DIR, 'public')));
app.use('/libreria*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'public/libreria/index.html'));
});
app.all('*', function (req, res, next) {
  res.status(404).send('Not Found');
})

app.listen(PORT, function () {
  console.log(`Static HTTP server listening on ${PORT}`)
})