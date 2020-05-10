const express = require('express');
const router = express.Router();
const ProductModel = require('../models/product.model');
const Token = require('../auth/jwt.js');


//dev: Mock data
//let usingList = require('../product.list');

// Delete elements. 	Deletes the product if exists and the request 
//						is from an authorized user
//
// @param id			ID of the product to delete
// @oaram type			Type of the deleted element
// @returns 			401 if not an authorized user
// @returns 			404 if not found in database
// @returns 			200 if OK 	
router.delete('/:type/:id', async function(req, res, next) {
	const isAdmin = Token.cookieCheckAdmin(req.cookies.Authorization);
	const type = req.params.type;
	const id = req.params.id;
	if(isAdmin){
		const result = await ProductModel.deleteOne({id: id, pType: type});
		if(result.deletedCount==1){
			res.status(200).send(`${req.params.type} ${req.params.id} removed from our database`);
		} else {
			res.status(404).send('This product was not found on our database!');
		}
	} else{
		res.status(401).send('Unauthorized to delete!');
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

// Add elements. 		Adds the product if it does not exist or manages exceptions.
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for adding to the database
// @returns 			204 if not enough parameters are resceived
// @returns 			500 if failure
// @returns 			401 if not an authorized user
// @returns 			201 if OK 		
router.post('/:type/:id', async function(req, res, next) {
  	let product;
  	const type = req.params.type;
	if(req.body.id&&req.body.prize&&req.body.img&&req.body.description){
		product={
			id: req.body.id,
			pType: type,
			prize: req.body.prize,
			img: req.body.img,
			description: req.body.description,
			sold: 0
		};
	}
	else{
		res.status(204).send('No content received');
	}
	const isAdmin = Token.cookieCheckAdmin(req.cookies.Authorization);
	if(isAdmin){
	  	ProductModel.create(product).then(
	  		(val)=>{
	  			res.status(201).send(`Created ${type} ${product.id}`);
	  		}).catch(
	  		(err)=>{
	  			res.status(500).json({err: err});
	  		});
	} else{
		res.status(401).send('Unauthorized to create!');
	}
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
	let product;
	if(req.body.id&&req.body.prize&&req.body.img&&req.body.description){
		product={
			id: req.body.id,
			pType: req.params.type,
			prize: req.body.prize,
			img: req.body.img,
			description: req.body.description
		};
	}
	const isAdmin = Token.cookieCheckAdmin(req.cookies.Authorization);
	if(isAdmin==true){
		const result = await ProductModel.updateOne({id: product.id},product);
		res.status(200).json(result);
	} else{
		res.status(401).send('Unauthorized to edit!');
	}
	/* Deprecated. Mock Data
	const prodIndex = usingList.findIndex( p=> p.id == product.id);

  	if(prodIndex >= 0){
  		usingList.splice(prodIndex,1,product);
  		res.status(200).send(`Edited ${type} ${product.id}`);
  	} else {
  		res.status(403).send('Element does not exist in database');
  	}
  	*/	
});

// Get an element. 		Gets the product if it does exist or returns
//						a 204 status response.
// @param id			Product ID
// @param type 			Type (BedBase or Mattress)
// @returns found 		Product at the database
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
	console.info('list');
	res.status(200).json(list);
	/* Deprecated
	const prodResponse = usingList.map(p => {
		if(p && (p.type == req.params.type)){
			return p;
		}
	});

	res.status(200).json(prodResponse).send();*/
});

module.exports = router
