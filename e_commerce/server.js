const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(express.json()); // This allows you to handle JSON input.

app.post("/signup", (req, res) => {
    const user_name = req.body["user_name"];
    const user_pwd = req.body["user_pwd"];
    const user_email = req.body["user_email"];

    console.log("Username:" + user_name);
    console.log("Password:" + user_pwd);
    console.log("Email:" + user_email);

    const insertQry = `INSERT INTO users (user_name, user_pwd, user_email) VALUES ('${user_name}', '${user_pwd}', '${user_email}')`

    pool.query(insertQry)
        .then((response) => {
            console.log("Data Saved")
            console.log(response)
        })
        .catch((err) => {
            console.log(err)
        })

    console.log("Received data: ", req.body);
    res.send("Response Received: " + req.body);
    res.json({
        message: "Response Received",
        yourDataReceived: req.body,
    });
});

app.post("/login", (req, res) => {
    const { user_pwd, user_email } = req.body;

    const searchQuery = "SELECT user_pwd, user_email FROM users WHERE user_pwd = $1 AND user_email = $2";

    pool.query(searchQuery, [user_pwd, user_email])
        .then((response) => {
            if (response.rows.length > 0) {
                res.json({ success: true, message: "Login successful!" });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: "An error occurred" });
        });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/adduser", (req, res, next) => {
//     console.log("Hello World!");
//     res.send("Response Recieved" + req.body);
// });

// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });
