import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";

const api = new express.Router();
let users;
let products;
let orders;

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/", api);
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
app.post('/users', async (req, res) => {
  let { uName, pw } = req.body;
  let user = await users.findOne({uName:uName,pw:pw});
  if (!user) {
    return res.status(400).json({ message: `Wrong info` });
  }
  // Login successful, return user data (potentially excluding sensitive fields like password)
  let User = {...user}; // Create a copy excluding password
  delete User.password;
  res.json(User);
});

// POST /users 
api.post('/users', async (req, res) => {
  let user = { uName, pw, fullName, adr, num } = req.body;
  const exist = await users.findOne({ uName: user.uName });
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

//POST NEW PRODUCT
api.post('/products', async (req, res) => {
  const newProduct = req.body;
  await products.insertOne(newProduct);
});

//PATCH EDIT PRODUCT
api.patch('/products/:id', async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  await products.updateOne({ id:id }, { $set: update });
});
//DELETE PRODUCT
api.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  await products.deleteOne({id:id });
});


//ORDERS
//GET ALL ORDERS
api.get('/orders', async (req, res) => {
  let allOrders = await orders.find({}).toArray(); 
  res.send(allOrders);
});

//GET USER'S ORDERS
api.get('/users/:uName/orders', async (req, res) => {
  let uName= req.param.uName;
  let uOrders = await orders.find({uName}).toArray(); 
  res.send(uOrders);
});

//CREATE ORDER
api.post('/users/:uName/orders', async (req, res) => {
  let order = req.body;
  await orders.insertOne(order);
});

export default initApi;
