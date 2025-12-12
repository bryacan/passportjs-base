import express from 'express';
import path from 'path';
import url from 'url';
import { model } from './model/model.mjs';
import { Usuario } from './model/usuario.mjs';
import mongoose from 'mongoose';

async function connect() {
  var uri = 'mongodb://127.0.0.1/libreria';
  mongoose.Promise = global.Promise;
  var db = mongoose.connection;
  db.on('connecting', function () { console.log('Connecting to ', uri); });
  db.on('connected', function () { console.log('Connected to ', uri); });
  db.on('disconnecting', function () { console.log('Disconnecting from ', uri); });
  db.on('disconnected', function () { console.log('Disconnected from ', uri); });
  db.on('error', function (err) { console.error('Error ', err.message); });
  return await mongoose.connect(uri);
}

await connect();

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
export const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/libros', async function (req, res, next) {
  res.json(await model.getLibros());
})

app.post('/api/autenticar',
  async function (req, res, next) {
    try {
      let usuario = await model.autenticar(req.body);
      if (!usuario) return res.status(401).json({ message: 'Not authenticated' });
      else return res.json(usuario);
    } catch (err) {
      res.status(401).json({ message: err.message })
    }
  });

app.get('/api/usuarios/:id',
  async function (req, res, next) {
    try {
      let usuario = await Usuario.findById(req.params.id);
      if (!usuario) res.status(404).json({ message: 'Usuario no encotnrado' })
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.post('/api/usuarios',
  async function (req, res, next) {
    try {
      let usuario = await model.addUsuario(req.body);
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: err.message })
    }
  })


app.put('/api/usuarios/:id',
  async function (req, res, next) {
    try {
      let obj = req.body;
      obj._id = req.params.id;
      let usuario = await model.updateUsuario(obj);
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message })
    }
  });


app.use('/', express.static(path.join(STATIC_DIR, 'public')));

app.use('/libreria*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'public/libreria/index.html'));
});


app.all('*', function (req, res, next) {
  console.error(`${req.originalUrl} not found!`);
  res.status(404).send('<html><head><title>Not Found</title></head><body><h1>Not found!</h1></body></html>')
})

app.listen(PORT, function () {
  console.log(`Static HTTP server listening on ${PORT}`)
})