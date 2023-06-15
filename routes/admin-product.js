const router = require("express").Router()
const Product = require("../model/product")
const Catagory = require("../model/catagory")

router.get("/", async (req, res) => {
  let count
  // await Product.count((err, number) => {
  //   count = number
  // })
  let products = await Product.find()
  // console.log(Product)
  res.render("admin-pages/product-page", {
    pageTitle: "Admin Area",
    products,
    // count
  })
})

router.get('/add-product', async(req, res) => {
  let title = ''
  let slug = ''
  let description = ''
  let images = []
  let price = 0
  let catagories = await Catagory.find().select("title")
  
  res.render("admin-pages/add-product", {
    pageTitle: "Admin area",
    title,
    slug,
    description,
    images,
    catagories, price
  })
})

router.post('/add-product', async (req, res) => {
  let { title, slug, price, catagory, images, description } = req.body

  if (images !== ""){
    images = images.split(",")
  }

  const errors = []
  if (title === "" || price === 0 || catagory === '' || description === "") {
    errors.push("Please fill (title, price, catagory and decription")
  }
  if (errors.length > 0) {
    let catagories = await Catagory.find().select("title")
    res.render("admin-pages/add-product", {
      pageTitle: "Admin area",
      errors,
      title, price, catagories, images, description,
      slug,
    })
  } else {
    let title = req.body.title.trim().toLowerCase()
    let slug = req.body.slug.trim().toLowerCase()
    if (slug === "") slug = title.replace("/\s+/g", "-")

    let product = await Product.create({
      title,
      slug,
      price,
      catagory,
      images,
      description
    })
    req.flash("success_msg", `You have successfully added the ${req.body.title} product.`)
    res.redirect("/admin/Product")
  }
})




router.get("/edit-Product/:id", async (req, res, next) => {
  let product = await Product.findById( req.params.id)
  res.render("admin-pages/edit-product", {
    pageTitle: "Admin area",
    ...product,
  })
})

// 
router.post("/edit-Product/:id", async (req, res, next) => {
  let { title, slug, price, catagory, images, description } = req.body
  images = images.split(",")
  await Product.findByIdAndUpdate(req.params.id, {
    $set: { title, slug, price, catagory, images, description }
  })
  req.flash("success_msg", `You have successfully edited the ${req.body.title} Product.`)
  res.redirect("/admin/product")
})

// let get the request of delete Product 
router.get("/delete-product/:id", async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id)
  req.flash("success_msg", `You have successfully deleted the ${req.body.title} Product.`)
  res.redirect("/admin/Product")
})
module.exports = router