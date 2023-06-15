require("dotenv").config()
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
// connect with data base
mongoose.connect("mongodb://localhost:27017/cart", (err) =>{
  if(!err) console.log("mognodb connected...")
  else console.log(err)
})


// set public folder
app.use(express.static("./public"))

// set view engine
app.set("view engine", "ejs")
app.use(expressLayouts)

// use bodyparser
app.use(express.urlencoded({extended : true}))

// app use session 
app.use(session({
  resave : true, 
  saveUninitialized : true,
  secret : "our little secret."
}))

// set global varialble 
app.use(flash())
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.err = req.flash("err")
  next()
})

// set routes 
app.use("/", require("./routes/home"))
app.use("/admin/pages", require("./routes/admin-page"))
app.use("/admin/catagory", require("./routes/admin-catagory"))
app.use("/admin/product", require("./routes/admin-product"))

// listening on the port 
const port = process.env.PORT || 5500
app.listen(port, console.log(`app is listening on Port: http://localhost:${port}`))

