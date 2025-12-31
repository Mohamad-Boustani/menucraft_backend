import cors from "cors";
import mysql from "mysql2";
import express from "express";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Database connection
const db = mysql.createPool({
  port: 3306,
  host: "mysql.railway.internal",
  user: "root",
  password: "hqbzxSzHfjPoNDoMVOfAVIkHUmCtzCvO",
  database: "railway",
});

// Test DB connection
db.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


/* ----------------------------------------------------
   FOOD CRUD
---------------------------------------------------- */
app.get("/food", (req, res) => {
  const q = "SELECT * FROM food";

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(204).send("No food items found");
    }
    return res.status(200).json(data);
  });
});

app.get("/food/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Food ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Food ID must be a number" });
  }

  const q = "SELECT * FROM food WHERE FoodID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }
    return res.status(200).json(data[0]);
  });
});

app.post("/food", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { FoodName, Price, Category, Description } = req.body;

  if (!FoodName || Price === undefined || !Category) {
    return res
      .status(400)
      .json({ message: "FoodName, Price, and Category are required" });
  }

  if (isNaN(Number(Price))) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  const q =
    "INSERT INTO food (FoodName, Price, Category, Description) VALUES (?, ?, ?, ?)";

  db.query(q, [FoodName, Price, Category, Description || null], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res
      .status(201)
      .json({ message: "Food item created successfully", id: data.insertId });
  });
});

app.put("/food/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { id } = req.params;
  const { FoodName, Price, Category, Description } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Food ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Food ID must be a number" });
  }

  if (!FoodName || Price === undefined || !Category) {
    return res
      .status(400)
      .json({ message: "FoodName, Price, and Category are required" });
  }

  if (isNaN(Number(Price))) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  const q =
    "UPDATE food SET FoodName = ?, Price = ?, Category = ?, Description = ? WHERE FoodID = ?";

  db.query(q, [FoodName, Price, Category, Description || null, id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }
    return res.status(200).json({ message: "Food item updated successfully" });
  });
});

app.delete("/food/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Food ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Food ID must be a number" });
  }

  const q = "DELETE FROM food WHERE FoodID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }
    return res.status(200).json({ message: "Food item deleted successfully" });
  });
});

/* ----------------------------------------------------
   ORDERS CRUD
---------------------------------------------------- */
app.get("/orders", (req, res) => {
  const q = "SELECT * FROM orders";

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(204).send("No orders found");
    }
    return res.status(200).json(data);
  });
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  const q = "SELECT * FROM orders WHERE OrderID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(data[0]);
  });
});

app.post("/orders", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { OrderDate, TotalPrice, UserID } = req.body;

  if (!OrderDate || TotalPrice === undefined || UserID === undefined) {
    return res
      .status(400)
      .json({ message: "OrderDate, TotalPrice, and UserID are required" });
  }

  if (isNaN(Number(TotalPrice)) || isNaN(Number(UserID))) {
    return res
      .status(400)
      .json({ message: "TotalPrice and UserID must be numbers" });
  }

  const q = "INSERT INTO orders (OrderDate, UserID, TotalPrice) VALUES (?, ?, ?)";

  db.query(q, [OrderDate, UserID, TotalPrice], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res
      .status(201)
      .json({ message: "Order created successfully", id: data.insertId });
  });
});

app.put("/orders/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { id } = req.params;
  const { OrderDate, TotalPrice } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  if (!OrderDate || TotalPrice === undefined) {
    return res
      .status(400)
      .json({ message: "OrderDate and TotalPrice are required" });
  }

  if (isNaN(Number(TotalPrice))) {
    return res.status(400).json({ message: "TotalPrice must be a number" });
  }

  const q =
    "UPDATE orders SET OrderDate = ?, TotalPrice = ? WHERE OrderID = ?";

  db.query(q, [OrderDate, TotalPrice, id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order updated successfully" });
  });
});

app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  const q = "DELETE FROM orders WHERE OrderID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  });
});

// Finalize an order by calculating total from order items
app.post("/orders/:id/finalize", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  const totalQuery =
    "SELECT SUM(Quantity * Price) AS total FROM orderitems WHERE OrderID = ?";

  db.query(totalQuery, [id], (err, totalRows) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const total = totalRows[0]?.total;

    if (total === null) {
      return res
        .status(400)
        .json({ message: "Order has no items to finalize" });
    }

    const updateQuery = "UPDATE orders SET TotalPrice = ? WHERE OrderID = ?";

    db.query(updateQuery, [total, id], (updateErr, data) => {
      if (updateErr) {
        return res
          .status(500)
          .json({ message: "Database error", error: updateErr });
      }

      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({
        message: "Order finalized successfully",
        orderId: Number(id),
        totalPrice: Number(total),
      });
    });
  });
});
// Upsert order item (increment if exists, insert if not)
app.post("/orderitems/upsert", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { OrderID, FoodID, Quantity, Price } = req.body;

  if (
    OrderID === undefined ||
    FoodID === undefined ||
    Quantity === undefined ||
    Price === undefined
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, Quantity, and Price are required",
    });
  }

  if (
    isNaN(Number(OrderID)) ||
    isNaN(Number(FoodID)) ||
    isNaN(Number(Quantity)) ||
    isNaN(Number(Price))
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, Quantity, and Price must be numbers",
    });
  }

  const findQuery =
    "SELECT OrderItemID, Quantity FROM orderitems WHERE OrderID = ? AND FoodID = ? LIMIT 1";

  db.query(findQuery, [OrderID, FoodID], (findErr, rows) => {
    if (findErr) {
      return res.status(500).json({ message: "Database error", error: findErr });
    }

    if (rows.length > 0) {
      const newQty = Number(rows[0].Quantity) + Number(Quantity);
      const updateQuery =
        "UPDATE orderitems SET Quantity = ?, Price = ? WHERE OrderItemID = ?";

      db.query(updateQuery, [newQty, Price, rows[0].OrderItemID], (updErr) => {
        if (updErr) {
          return res
            .status(500)
            .json({ message: "Database error", error: updErr });
        }
        return res.status(200).json({
          message: "Order item updated successfully",
          id: rows[0].OrderItemID,
          quantity: newQty,
        });
      });
    } else {
      const insertQuery =
        "INSERT INTO orderitems (OrderID, FoodID, Quantity, Price) VALUES (?, ?, ?, ?)";

      db.query(insertQuery, [OrderID, FoodID, Quantity, Price], (insErr, data) => {
        if (insErr) {
          return res
            .status(500)
            .json({ message: "Database error", error: insErr });
        }
        return res.status(201).json({
          message: "Order item created successfully",
          id: data.insertId,
          quantity: Number(Quantity),
        });
      });
    }
  });
});

// Update quantity for an order item by OrderID and FoodID
app.put("/orderitems/by-order-food", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { OrderID, FoodID, Quantity, Price } = req.body;

  if (
    OrderID === undefined ||
    FoodID === undefined ||
    Quantity === undefined
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, and Quantity are required",
    });
  }

  if (
    isNaN(Number(OrderID)) ||
    isNaN(Number(FoodID)) ||
    isNaN(Number(Quantity))
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, and Quantity must be numbers",
    });
  }

  if (Number(Quantity) <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than zero" });
  }

  const updateQuery =
    "UPDATE orderitems SET Quantity = ?, Price = COALESCE(?, Price) WHERE OrderID = ? AND FoodID = ?";

  db.query(updateQuery, [Quantity, Price || null, OrderID, FoodID], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }
    return res.status(200).json({ message: "Order item updated successfully" });
  });
});
/* ----------------------------------------------------
   ORDER ITEMS CRUD
---------------------------------------------------- */
app.get("/orderitems", (req, res) => {
  const q = "SELECT * FROM orderitems";

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(204).send("No order items found");
    }
    return res.status(200).json(data);
  });
});

app.get("/orderitems/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "OrderItem ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "OrderItem ID must be a number" });
  }

  const q = "SELECT * FROM orderitems WHERE OrderItemID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }
    return res.status(200).json(data[0]);
  });
});

app.post("/orderitems", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { OrderID, FoodID, Quantity, Price } = req.body;

  if (
    OrderID === undefined ||
    FoodID === undefined ||
    Quantity === undefined ||
    Price === undefined
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, Quantity, and Price are required",
    });
  }

  if (
    isNaN(Number(OrderID)) ||
    isNaN(Number(FoodID)) ||
    isNaN(Number(Quantity)) ||
    isNaN(Number(Price))
  ) {
    return res.status(400).json({
      message: "OrderID, FoodID, Quantity, and Price must be numbers",
    });
  }

  const q =
    "INSERT INTO orderitems (OrderID, FoodID, Quantity, Price) VALUES (?, ?, ?, ?)";

  db.query(q, [OrderID, FoodID, Quantity, Price], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(201).json({
      message: "Order item created successfully",
      id: data.insertId,
    });
  });
});

app.put("/orderitems/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { id } = req.params;
  const { Quantity, Price } = req.body;

  if (!id) {
    return res.status(400).json({ message: "OrderItem ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "OrderItem ID must be a number" });
  }

  if (Quantity === undefined || Price === undefined) {
    return res
      .status(400)
      .json({ message: "Quantity and Price are required" });
  }

  if (isNaN(Number(Quantity)) || isNaN(Number(Price))) {
    return res
      .status(400)
      .json({ message: "Quantity and Price must be numbers" });
  }

  const q =
    "UPDATE orderitems SET Quantity = ?, Price = ? WHERE OrderItemID = ?";

  db.query(q, [Quantity, Price, id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }
    return res.status(200).json({ message: "Order item updated successfully" });
  });
});

// Delete order items by OrderID and FoodID (for removing single item from cart)
// MUST be before /:id route to match correctly
app.delete("/orderitems/by-order-food", (req, res) => {
  const { OrderID, FoodID } = req.body;

  if (OrderID === undefined || FoodID === undefined) {
    return res.status(400).json({ message: "OrderID and FoodID are required" });
  }

  if (isNaN(Number(OrderID)) || isNaN(Number(FoodID))) {
    return res.status(400).json({ message: "OrderID and FoodID must be numbers" });
  }

  const q = "DELETE FROM orderitems WHERE OrderID = ? AND FoodID = ?";

  db.query(q, [OrderID, FoodID], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }
    return res.status(200).json({ message: "Order item deleted successfully" });
  });
});

// Delete all order items for an order (for clearing entire cart)
// MUST be before /:id route to match correctly
app.delete("/orderitems/by-order/:orderId", (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (isNaN(Number(orderId))) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  const q = "DELETE FROM orderitems WHERE OrderID = ?";

  db.query(q, [orderId], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json({ message: "Order items cleared successfully" });
  });
});

app.delete("/orderitems/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "OrderItem ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "OrderItem ID must be a number" });
  }

  const q = "DELETE FROM orderitems WHERE OrderItemID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }
    return res.status(200).json({ message: "Order item deleted successfully" });
  });
});

/* ----------------------------------------------------
   USERS CRUD
---------------------------------------------------- */
app.get("/users", (req, res) => {
  const q = "SELECT UserID, Fname, Lname, Phone, Address FROM user";

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(204).send("No users found");
    }
    return res.status(200).json(data);
  });
});

app.post("/login", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { Phone, Password } = req.body;

  if (!Phone || !Password) {
    return res.status(400).json({ message: "Phone and Password are required" });
  }

  const q = "SELECT UserID, Fname, Lname, Phone, Address FROM user WHERE Phone = ? AND Password = ?";

  db.query(q, [Phone, Password], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }
    return res.status(200).json({ message: "Login successful", user: data[0] });
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "User ID must be a number" });
  }

  const q =
    "SELECT UserID, Fname, Lname, Phone, Address FROM user WHERE UserID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(data[0]);
  });
});

app.post("/users", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { Fname, Lname, Phone, Address, Password } = req.body;

  if (!Fname || !Lname || !Phone || !Address || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q =
    "INSERT INTO user (Fname, Lname, Phone, Address, Password) VALUES (?, ?, ?, ?, ?)";

  db.query(q, [Fname, Lname, Phone, Address, Password], (err, data) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(400).json({ message: err.sqlMessage });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res
      .status(201)
      .json({ message: "User created successfully", id: data.insertId });
  });
});

app.put("/users/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const { id } = req.params;
  const { Fname, Lname, Phone, Address, Password } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "User ID must be a number" });
  }

  if (!Fname || !Lname || !Phone || !Address || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q =
    "UPDATE user SET Fname = ?, Lname = ?, Phone = ?, Address = ?, Password = ? WHERE UserID = ?";

  db.query(q, [Fname, Lname, Phone, Address, Password, id], (err, data) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(400).json({ message: err.sqlMessage });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully" });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "User ID must be a number" });
  }

  const q = "DELETE FROM user WHERE UserID = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  });
});
