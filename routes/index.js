var express              = require('express');
var router               = express.Router();
// const keyPublishable     = process.env.PUBLISHABLE_KEY;
// const keySecret          = process.env.SECRET_KEY;



/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index.ejs', {
    // keyPublishable:       process.env.PUBLISHABLE_KEY,
    userInfo:             req.user
    // keyPublishable: keyPublishable
  });
});

module.exports = router;
