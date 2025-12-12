import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const schema = Schema({
  carro: { type: Schema.Types.ObjectId, ref: 'Carro' },
  dni: { type: String, required: true }, 
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  direccion: { type: String, required: true },
  // telefono: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
});
export let Usuario = mongoose.model('Usuario', schema);

