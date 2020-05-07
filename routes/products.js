const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = require('../models/product.model');

//dev: Mock data
let usingList = require('../product.list');

// Delete elements. Deletes the product if exists or returns a 404 status response.
// @param productId 	ID of the product to delete.
// @oaram type			Type of the deleted element
router.delete('/:type/:id', async function(req, res, next) {
	const type = req.params.type;
	const id = req.params.id;
	const result = await ProductModel.deleteOne({id: id, pType: type});
	if(result.deletedCount==1){
		res.status(200).send(`${req.params.type} ${req.params.id} removed from our database`);
	} else {
		res.status(404).send('This product was not found on our database!');
	}

	/* Mock Data. Deprecated
	const productId = req.params.id;
	const prodIndex = usingList.findIndex( p=> p.id == productId);
	if (prodIndex < 0) {
		res.status(404).send('This product was not found on our database!');
	} else {
		usingList.splice(prodIndex,1);
		console.info(usingList);
		res.status(200).send(`${req.params.type} ${req.params.id} removed from our database`);
	}*/
});

// Add elements. Adds the product if it does not exist or returns a 403 status response.
// TODO: Exception Management. Incorrect message is sent back
// @param productI 		Product information from Angular
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for adding to the database
router.post('/:type/:id', async function(req, res, next) {
  	let productI;
	if(req.body.product){
		productI = JSON.parse(req.body.product);
	}
  	const type = req.params.type;
  	ProductModel.create({
  		id: productI.id,
  		prize: productI.prize,
  		pType: type,
  		sold: 0,
  		img: productI.url,
  		description: productI.description
  	}).then(
  		val=>{
  			res.status(201).send(`Created ${type} ${product.id}`);
  		}).catch(
  		err=>{
  			res.status(403).send(err);
  		});
  	/* Mock data. Deprecated

  	const found = usingList.some( p=> p.id == product.id);

  	if(!found){
  		usingList.push(product);
  		res.status(201).send(`Created ${type} ${product.id}`);
  	} else {
  		res.status(403).send('Element exist in database');
  	}*/

});


// Edit elements. Edits the product if it does exist or returns a 403 status response.
// Important: Sold attribute is reset to 0. It should? (No prob at MongoDB since update is only 
// in the required attributes)
// TODO: Mongoose API for editing an object in MongoDB. Add exceptions, modify messages
// @param productI 		Product information from Angular
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for modification at the database
router.put('/:type/:id', async function(req, res, next) {
	let productI;
	if(req.body.product){
		productI = JSON.parse( req.body.product);
	}
	const type = req.params.type;
	const product = {
  		id: productI.id,
  		prize: productI.prize,
  		type: type,
  		sold: 0,
  		img: productI.url,
  		description: productI.description
	}
	const result = await ProductModel.updateOne({id: product.id},product);
	/* Deprecated. Mock Data
	const prodIndex = usingList.findIndex( p=> p.id == product.id);

  	if(prodIndex >= 0){
  		usingList.splice(prodIndex,1,product);
  		res.status(200).send(`Edited ${type} ${product.id}`);
  	} else {
  		res.status(403).send('Element does not exist in database');
  	}
  	*/
  	res.status(200).json(result);
});

// Get an element. Gets the product if it does exist or returns a 403 status response.
// @param productI 		Product information from Angular
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for modification at the database
router.get('/:type/:id', async function(req, res, next) {
  	const type = req.params.type;
  	const id = req.params.id;
  	const found = await ProductModel.findOne({pType: type, id: id});
  	if(found){
  		res.status(200).json(found);
  	} else {
  		res.status(204).send(`Not found ${type} ${id}`);
  	}
  	/* Deprecated. Mock Data
  	const found = usingList.some( p=> (p.id == id && p.type == type));
  	if(found==false){
  		res.status(204).send(`Not found ${type} ${id}`);
  	} else {
  		const prod = usingList.find(p=>p.id==id);
  		res.status(200).json(prod);
  	}
  	*/
});

// Element list. Returns a product list based on its type.
// @param type 			Type (BedBase or Mattress)
router.get('/:type', async function(req, res, next) {
	const type = req.params.type;
	const list = await ProductModel.find({pType: type});
	res.status(200).json(list);
	/* Deprecated
	const prodResponse = usingList.map(p => {
		if(p && (p.type == req.params.type)){
			return p;
		}
	});

	res.status(200).json(prodResponse).send();*/
});

/*TODO: Organization of response*/
router.get('/dashboard'), async function(req,res,next) {
	const bdResp = await ProductModel.find({});
	/*bdResp.sort((p1,p2) => {
		if(p1.sold>p2.sold){
			return -1;
		} else if (p1.sold<p2.sold){
			return 1;
		} else {
			return 0;
		}
	} );*/
	if(bdResp.length<5){
		res.status(200).json(bdResp);
	} else{
		res.status(200).json(bdResp.slice(0,6));
	}
	/*
	const prodList = usingList.sort((p1,p2) => {
		if(p1.sold>p2.sold){
			return -1;
		} else if (p1.sold<p2.sold){
			return 1;
		} else {
			return 0;
		}
	} );

	const prodResponse = prodList.slice(0,6);
	res.status(200).json(usingList);*/
}

module.exports = router
