var express              = require('express');
var router               = express.Router();

//Render Home Page
router.get('/', (req, res, next) => {
  res.render('index.ejs', {
    userInfo:             req.user
  });
});

module.exports = router;
