const router = require("express").Router()

router.get('/', (req, res) => {
  res.send(`You have entered at user home page.`)
})

module.exports = router