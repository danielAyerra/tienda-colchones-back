const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const Token = require('../auth/jwt.js');

/*TODO: - Authentication system
 * 	 	- Usage of JWT Token
 *		- Password in Mongo should be encrypted!
 */
router.post('/login', async function(req, res, next) {
  let user;
  let pass;
  if(req.body.user&&req.body.pass){
  	user=req.body.user;
  	pass=req.body.pass;
  } else {
  	return res.status(400).json(userInfo);
  }
  const dbUser = await UserModel.findOne({email:user, pass:pass});
  if(!dbUser){
  	return res.status(401).json({res:false});
  }
  const token = Token.cookieSign(user, pass);
  return res.status(202).cookie('Authorization',token, 
  	{expires: new Date(Date.now() + 18000000)})
  .json({res:true});
});

router.post('/checkAdmin', function(req, res, next){
	const token = Token.cookieCheck(req.body.Authorization);
	if(token.ver==true){
		const resp = token.resp;
		return res.status(200).json(resp.isAdmin);
	}
	else{
		return res.status(401).json(false);
	}

});

router.post('/pass', function(req, res, next){

});
module.exports = router;
