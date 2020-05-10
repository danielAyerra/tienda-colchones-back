const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const Token = require('../auth/jwt.js');
const mongoose = require('mongoose')

/*TODO: 
 *		- Password in Mongo should be encrypted!
 */
router.post('/login', async function(req, res, next) {
  let user;
  let pass;
  if(req.body.user&&req.body.pass){
  	user=req.body.user;
  	pass=req.body.pass;
  } else {
  	return res.status(400).json({message: 'No credentials sent'});
  }
  const dbUser = await UserModel.findOne({email:user, pass:pass});
  if(!dbUser){
  	return res.status(401).json({res:false});
  }
  const token = Token.cookieSign(user, dbUser.isAdmin);
  return res.status(202).cookie('Authorization',token, 
  	{expires: new Date(Date.now() + 18000000)})
  .json({res:true});
});

router.get('/checkAdmin', function(req, res, next) {
	const isAdmin = Token.cookieCheckAdmin(req.cookies.Authorization);
	if(isAdmin==true) {
		res.status(200).json({message:true}).send();
	}
	else {
		res.status(401).json({message:false}).send();
	}
});

module.exports = router;
