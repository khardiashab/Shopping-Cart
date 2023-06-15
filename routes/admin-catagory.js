const router = require("express").Router()
const Catagory = require("../model/catagory")

router.get("/", async(req, res) =>{
  let catagory = await Catagory.find()
  // console.log(catagory)
  res.render("admin-pages/catagory-page", {
    pageTitle : "Admin Area",
    catagory,

  })
})

router.get('/add-catagory', (req, res) => {
  let title = ''
  let slug = ''
  res.render("admin-pages/add-catagory", {
    pageTitle: "Admin area",
    title,
    slug,
  })
})

router.post('/add-catagory', async(req, res) => {
  let title = req.body.title.trim().toLowerCase()
  let slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, "-")
  if(slug === "") slug = title.replace(/\s+/g, "-")
  const errors = []
  if(req.body.title === "") {
    errors.push("Title can't be empty. You must add title.")
  }
  if(errors.length > 0 ){
    res.render("admin-pagess/add-catagorys", {
      errors,
      catagoryTitle: "Admin area",
      title,
      slug,
    })
  } else {
    let title = req.body.title.trim().toLowerCase()
    let slug = req.body.slug.trim().toLowerCase()
    if(slug === "") slug = title.replace("/\s+/g", "-")

    let catagory = await Catagory.findOne({slug : slug})
    if(!catagory){
      catagory = new Catagory({
        title, slug
      })
      await catagory.save()
      req.flash("success_msg",  "You submitted a catagory successfully.")
      res.redirect("/admin/catagory")
    } else {
    // console.log(`this is the catagory>>> : ${catagory}`)

      req.flash("error_msg" , "This slug catagory is already used. Choose another one.")
      res.render("admin-pages/add-catagory", {
        catagoryTitle: "Admin area",
        title,
        slug,
      })
    }

  }
})




router.get("/edit-catagory/:slug" ,  async( req, res, next ) =>{
  let catagory = await Catagory.findOne({slug : req.params.slug})

  res.render("admin-pages/edit-catagory", {
    pageTitle: "Admin area",
    title : catagory.title,
    slug : catagory.slug,
    id : catagory._id
  })
})

// 
router.post("/edit-catagory/:slug", async(req, res, next) =>{
  // console.log(req.body)
  await Catagory.findByIdAndUpdate(req.body.id, {$set : {
    title :req.body.title, 
    slug : req.body.slug, 
  }})
  req.flash("success_msg", `You have successfully edited the ${req.body.title} catagory.`)
  res.redirect("/admin/catagory")
})


// let get the request of delete catagory 
router.get("/delete-catagory/:id", async( req, res, next) => {
  await Catagory.findByIdAndDelete(req.params.id )
  req.flash("success_msg", `You have successfully deleted the ${req.body.title} catagory.`)
  res.redirect("/admin/catagory")
})
module.exports = router