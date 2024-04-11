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


//GET /user/id
api.get('/users', async (req, res) => {
  const { name, email ,pw} = req.query;
  if (!name && !email) {
    return res.status(400).json({ message: "Missing name or email in query string" });
  }
  try {
    const foundUser = users.find(user => (user.name === name || user.email === email)&&(user.pw===pw));
    if (!foundUser) {
      return res.status(404).json({ message: "Invalid info" });
    }
    const { pw, ...userData } = foundUser; // Destructuring assignment
    res.json(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /users/:id
api.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await users.findOne({ id: userId }); 
  if (!user) {
    return res.status(404).send({ error: "No user with ID " + userId });
  }
  res.send(user);
});

// POST /users 
api.post('/users', async (req, res) => {
  const newUserId = req.body.id;

  if (!newUserId || newUserId.trim() === "") {
    return res.status(400).send({ error: "User ID is missing or empty" });
  }
  const existingUser = await users.findOne({ id: newUserId });
  if (existingUser) {
    return res.status(400).send({ error: "User ID already exists" });
  }

  const newUser = {
    id: newUserId,
    name: newUserId, 
    avatarURL: "images/default.png",
    following: [],
  };
  await users.insertOne(newUser); 
  res.send(newUser);
});
//GET /user/:id/orders
//POST /user/:id/orders

// GET /products
api.get('/products', async (req, res) => {
  let allProducts = await products.find({}).toArray(); 
  console.log(allProducts);
  res.send(allProducts);
});
//POST product
//PATCH product
//DELETE product
// GET /orders
api.get('/orders', async (req, res) => {
  let allOrders = await orders.find({}).toArray(); 
  res.send(allOrders);
});

// GET /orders by userid
api.get('/users/:id/orders', async (req, res) => {
  // Extract user ID from the request parameter
  const id = req.params.id;
  let allOrders = await orders.find({ id }).toArray();
  res.send(allOrders);
});

export default initApi;
