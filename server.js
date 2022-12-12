/*
Realizar un proyecto de servidor basado en node.js y express que ofrezca una API RESTful de productos.
En detalle, que incorpore las siguientes rutas:
GET '/api/productos' -> devuelve todos los productos.
GET '/api/productos/:id' -> devuelve un producto según su id.
POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
DELETE '/api/productos/:id' -> elimina un producto según su id.
Para el caso de que un producto no exista, se devolverá el objeto:
{ error : 'producto no encontrado' }
Implementar la API en una clase separada, utilizando un array como soporte de persistencia en memoria.
Incorporar el Router de express en la url base '/api/productos' y configurar todas las subrutas en base a este.
Crear un espacio público de servidor que contenga un documento index.html con un formulario de ingreso de productos con los datos apropiados.
El servidor debe estar basado en express y debe implementar los mensajes de conexión al puerto 8080 y en caso de error, representar la descripción del mismo.
Las respuestas del servidor serán en formato JSON. La funcionalidad será probada a través de Postman y del formulario de ingreso.
*/

const express = require('express')
const { Router } = express

const app = express()

const apiRouter = Router()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


const Contenedor = require('./contenedor.js')
const productos = new Contenedor('productos.txt')


/* ROUTER apiRouter */
app.use('/api', apiRouter)

/*get productos*/
apiRouter.get('/productos', async (req, res) => {
  const allProducts = await productos.getAll()
  res.json( allProducts )
})

/*get producto segun id*/
apiRouter.get('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const producto = await productos.getById( id )
  producto ? res.json( producto )
    : res.status(404).send({ error: 'producto no encontrado'})
})

/*post producto*/
apiRouter.post('/productos', async (req, res) => {
  const productoToAdd = req.body
  const idNew = await productos.save( productoToAdd )
  res.send({ idNew })
})


/*put producto*/
apiRouter.put('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const productoToModify = req.body

  if(await productos.getById( id )){
    let allProducts = await productos.getAll()
    allProducts[ id - 1 ] = {"id": id, ...productoToModify}
    productos.saveFile( allProducts )
    res.send({ productoToModify })
  } else {
    res.status(404).send({ error: 'id no valido'})
  }
})


/*delete producto*/
apiRouter.delete('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const productoToDelete = await productos.getById( id )

  if (productoToDelete) {
    await productos.deleteById( id )
    res.send({ borrado: productoToDelete})
  } else {
    res.status(404).send({ error: 'producto no encontrado'})
  }
})




app.listen(8080, () => console.log('escuchando en 8080'))