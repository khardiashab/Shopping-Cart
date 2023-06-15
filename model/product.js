const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
  title : {
    type : String, 
    required : true
  },
  slug : {
    type : String, 
  },
  price :{
    type : Number,
  },
  catagory: {
    type : String,
    required : true
  },
  images: [{
    type :String,
    default : []
  }],
  description : {
    type : String, 
    required : true
  },

})

module.exports = mongoose.model("Product", ProductSchema)