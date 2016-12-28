var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/authorize',
  passport.authenticate('smartthings', { scope: ['app'] , session: false})
);

router.get('/authorize/callback',
  passport.authenticate('smartthings', { scope: ['app'] , session: false}),
    function (req, res) {
      console.log(req, res);
      res.redirect('/');
    }
  );

module.exports = router;
