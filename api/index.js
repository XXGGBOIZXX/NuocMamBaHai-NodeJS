import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";

const api = new express.Router();
let users;
let products;
let orders;

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);
  let conn = await MongoClient.connect("mongodb://127.0.0.1");
  let db = conn.db("JSfinal");
  users = db.collection("users");
  products = db.collection("products");
  orders= db.collection("orders");
};

api.use(bodyParser.json());

//get/
api.get('/', (req, res) => {
  res.send("GET success");
});

//USERS
//POST login
api.post('/users', async (req, res) => {
  let { username, password } = req.body;
  let user = await users.findOne({username:username,password:password});
  if (!user) {
    return res.status(400).json({ message: `Invalid info` });
  }
  // Login successful, return user data (potentially excluding sensitive fields like password)
  let User = {...user}; // Create a copy excluding password
  delete User.password;
  res.json(User);
});

// PUT /users 
api.put('/users', async (req, res) => {
  let username= req.body.username;
  let phone= req.body.phone;
  let address= req.body.address;
  let password= req.body.password;
  let fullname= req.body.fullname;
  let user = { username, password, fullname, address, phone };
  const exist = await users.findOne({ username: username });
  if (exist) {
    return res.status(400).json({ message: `Info in use` });
  }
  await users.insertOne(user); 
  let User = {...user };
  delete User.password;
  res.send(User);
});


//PRODUCTS
// GET ALL PRODUCTS
api.get('/products', async (req, res) => {
  let allProducts = await products.find({}).toArray(); 
  res.send(allProducts);
});

//GET PRODUCT
api.get('/products/:id', async (req, res) => {
  let id= parseInt(req.params.id);
  let product = await products.findOne({id}); 
  res.send(product);
});

//PUT NEW PRODUCT
api.put('/products', async (req, res) => {
  let newProduct = req.body;
  let allProducts = await products.find({}).toArray(); 
  let newId=1;
  for (const product of allProducts) {
    newId+=1;
  }
  newProduct.id=newId;
  console.log(newProduct);
  await products.insertOne(newProduct);
  res.status();
});

//PATCH EDIT PRODUCT
api.patch('/products/:id', async (req, res) => {
  let id= parseInt(req.params.id);
  const update = req.body;
  await products.updateOne({ id}, { $set: update });
  res.status();
});

//DELETE PRODUCT
api.delete('/products/:id', async (req, res) => {
  let id= parseInt(req.params.id);
  await products.deleteOne({id});
  res.status(200).json({item:id});
});


//ORDERS
//GET ALL ORDERS
api.get('/orders', async (req, res) => {
  let allOrders = await orders.find({}).toArray(); 
  res.send(allOrders);
});


//CREATE ORDER
api.put('/orders', async (req, res) => {
  let order = req.body;
  await orders.insertOne(order);
  res.status();

});

export default initApi;
