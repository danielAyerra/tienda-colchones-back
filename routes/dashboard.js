const express = require('express');
const router = express.Router();
const ProductModel = require('../models/product.model');

/*TODO: Organization of response*/
router.get('/dashboard', async function(req, res, next) {
	const bedBaseList = await ProductModel.find({pType: 'BedBase'});
	const matressList = await ProductModel.find({pType: 'Mattress'});
	let prodlist = [];
	bedBaseList.forEach(p=>{
		prodlist.push(p);
	});
	matressList.forEach(p=>{
		prodlist.push(p);
	});
	const sortList=prodlist.sort((a,b)=>{
		const soldA = a.sold;
		const soldB = b.sold;
		let compare;
		if(soldA>soldB){
			compare=-1;
		} else if(soldA<soldB){
			compare=1;
		} else {
			compare=0;
		}
		return compare;
	});
	res.status(200).json(sortList.slice(0,6));
});

module.exports = router
