//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const username = require("./config/keys").user;
const password = require("./config/keys").password;
const passport = require("passport");

const app = express(); // Create instance of express
const userRoutes = require("./routes/api/users");

//BodyParser middleware | Dependency Injection || Commented out code is deprecated
// app.use(
//     bodyParser.urlencoded()
// );
// app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Add passport middleware | Dependency Injection
app.use(passport.initialize());
require("./config/passport")(passport);

//Add routes
app.use("/api/users", userRoutes);

//Database Config

//Import connection strings

mongoose
  .connect(
    db,
    {
      user: username,
      pass: password,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } // i had to pass the user in like this because it doesnt work for poes with username and password in con string
  )
  .then(() => console.log("MongoDB Successfully created"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000; // heroku port

app.listen(port, () => console.log(`Server up and running on port ${port}`)); //Note , in order to use ${} the quotes need to be  `` - The ones by the tilde
