const router = require("express").Router()
const Pages = require('../model/page')

router.get("/", async (req, res) => {
  let page = await Pages.find().sort({ "sorting": "ascending" })
  // console.log(page)
  res.render("admin-pages/page", {
    pageTitle: "Admin Area",
    page,

  })
})

router.get('/add-pages', (req, res) => {
  let title = ''
  let slug = ''
  let content = ''
  res.render("admin-pages/add-pages", {
    pageTitle: "Admin area",
    title,
    slug,
    content
  })
})

router.post('/add-pages', async (req, res) => {
  let title = req.body.title.trim().toLowerCase()
  let slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, "-")
  if (slug === "") slug = title.replace(/\s+/g, "-")
  let content = req.body.content.trim()
  const errors = []
  if (req.body.title === "") {
    errors.push("Title can't be empty. You must add title.")
  }
  if (req.body.content === "") {
    errors.push("Content can't be empty. You must add content.")
  }
  if (errors.length > 0) {
    res.render("admin-pages/add-pages", {
      errors,
      pageTitle: "Admin area",
      title,
      slug,
      content
    })
  } else {
    let title = req.body.title.trim().toLowerCase()
    let slug = req.body.slug.trim().toLowerCase()
    if (slug === "") slug = title.replace("/\s+/g", "-")
    let content = req.body.content.trim()

    let page = await Pages.findOne({ slug: slug })
    let sorting = slug === "home" ? 0 : 100
    if (!page) {
      page = new pages({
        title, slug, content, sorting
      })
      await page.save()
      req.flash("success_msg", "You submitted a page successfully.")
      res.redirect("/admin/pages")
    } else {
      // console.log(`this is the page>>> : ${page}`)

      req.flash("error_msg", "This slug page is already used. Choose another one.")
      res.render("admin-pages/add-pages", {
        pageTitle: "Admin area",
        title,
        slug,
        content: content,
      })
    }

  }
})

router.post("/reorder-pages", async (req, res, next) => {
  let count = 1;
  req.body.ids.forEach(async (id) => {
    await Pages.findByIdAndUpdate(id, { $set: { sorting: count++ } })
  })
  res.redirect("/admin/pages")
})


router.get("/edit-pages/:id", async (req, res, next) => {
  let page = await Pages.findById( req.params.id )

  res.render("admin-pages/edit-pages", {
    pageTitle: "Admin area",
    title: page.title,
    slug: page.slug,
    content: page.content,
    id: page._id
  })
})

// 
router.post("/edit-pages/:id", async (req, res, next) => {
  // console.log(req.body)
  let title = req.body.title.trim().toLowerCase()
  let content = req.body.content
  let slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, "-")
  if (slug === "") slug = title.replace(/\s+/g, "-")

  const errors = []
  if (req.body.title === "") {
    errors.push("Title can't be empty. You must add title.")
  }
  if(content === ""){
    errors.push("Content can't be empty. You must add content.")
  }
  if (errors.length > 0) {
    res.render("admin-pages/edit-pages", {
      errors,
      pageTitle: "Admin area",
      title,
      slug,
      content,
      id : req.params.id
    })
  } else{
    await Pages.findByIdAndUpdate(req.body.id, {
      $set: {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content
      }
    })
    req.flash("success_msg", `You have successfully edited the ${req.body.title} page.`)
    res.redirect("/admin/pages")
  }
})


// let get the request of delete page 
router.get("/delete-pages/:id", async (req, res, next) => {
  await Pages.findByIdAndDelete(req.params.id)
  req.flash("success_msg", `You have successfully deleted the ${req.body.title} page.`)
  res.redirect("/admin/pages")
})
module.exports = router