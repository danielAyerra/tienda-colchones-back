const secretKey = "weinman";
const jwt = require('jsonwebtoken');

cookieSign=function(user, isAdmin){
	const token = jwt.sign({user: user, isAdmin: isAdmin}, secretKey, {expiresIn: '4h'});
	return token;
};

cookieCheck=function(cookie){
	try{
		const resp = jwt.verify(cookie, secretKey);
		return {ver:true, res: resp};
	} catch(err){
		return {ver:false, res: err};
	}
};

cookieCheckAdmin=function(cookie){
	try{
		const token = jwt.verify(cookie, secretKey);
		if(!token.isAdmin){
			return false;
		}
		if(token.isAdmin==true){
			return true;
		}
		else{
			return false;
		}
	} catch(err){
		return false;
	}
}

module.exports={cookieSign, cookieCheck, cookieCheckAdmin};