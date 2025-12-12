import mongoose from 'mongoose';
import { model } from './model.mjs';


export function crearLibro(isbn) {
  return {
    isbn: `${isbn}`,
    titulo: `TITULO_${isbn}`,
    autores: `AUTOR_A${isbn}; AUTOR_B${isbn}`,
    resumen:
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ullamcorper massa libero, eget dapibus elit efficitur id. Suspendisse id dui et dui tincidunt fermentum. Integer vel felis purus. Integer tempor orci risus, at dictum urna euismod in. Etiam vitae nisl quis ipsum fringilla mollis. Maecenas vitae mauris sagittis, commodo quam in, tempor mauris. Suspendisse convallis rhoncus pretium. Sed egestas porta dignissim. Aenean nec ex lacus. Nunc mattis ipsum sit amet fermentum aliquam. Ut blandit posuere lacinia. Vestibulum elit arcu, consectetur nec enim quis, ullamcorper imperdiet nunc. Donec vel est consectetur, tincidunt nisi non, suscipit metus._[${isbn}]`,
    portada: `http://google.com/${isbn}`,
    stock: 5,
    precio: (Math.random() * 100).toFixed(2),
    // borrado: false,
    // _id: -1,
  };
}


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

async function disconnect() {
  return await mongoose.disconnect();
}

export async function seed() {
  const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
  let libros = ISBNS.map(isbn => crearLibro(isbn));
  try {
    await connect();
    await model.setClientes([]);
    await model.setLibros(libros);
  } catch (err) {
    console.error(err);
  } finally {
    disconnect();
  }
}

seed();