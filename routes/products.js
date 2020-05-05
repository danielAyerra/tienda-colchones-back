var express = require('express');
var router = express.Router();
const ProdList = require('../product.list');
let usingList = [];

/*TODO: This function should be for initializing Mongo DB collection, if not available
for now, using a demo.*/
const initProductDB = funtion(){
	usingList = ProdList.map(x => x);
	console.info(usingList);
}

// Delete elements. Deletes the product if exists or returns a 404 status response.
// TODO: Mongoose API for deleting an object from MongoDB
// @param productId 	ID of the product to delete.
// @oaram type			Type of the deleted element
router.delete('/:type/:id', function(req, res, next) {
	const productId = req.params.id;
	const prodIndex = usingList.findIndex( p=> p.id == productId);
	if (prodIndex < 0) {
		res.status(404).send('This product was not found on our database!');
	} else {
		usingList.splice(prodIndex,1);
		console.info(usingList);
		res.status(200).send(`${req.params.type} ${req.params.id} removed from our database`);
	}
});

// Add elements. Adds the product if it does not exist or returns a 403 status response.
// TODO: Mongoose API for adding an object in MongoDB. Add exceptions.
// @param productI 		Product information from Angular
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for adding to the database
router.post('/:type/:id', function(req, res, next) {
  	const productI = req.body.product;
  	const type = req.params.type;
  	const product = {
  		id: productI.id,
  		prize: productI.prize,
  		type: type,
  		sold: 0,
  		img: productI.url,
  		description: productI.description
  	};
  	const found = usingList.some( p=> p.id == product.id);

  	if(!found){
  		usingList.push(product);
  		res.status(201).send(`Created ${type} ${product.id}`);
  	} else {
  		res.status(403).send('Element exist in database');
  	}
});


// Edit elements. Edits the product if it does exist or returns a 403 status response.
// Important: Sold attribute is reset to 0. It should? (No prob at MongoDB since update is only 
// in the required attributes)
// TODO: Mongoose API for editing an object in MongoDB. Add exceptions.
// @param productI 		Product information from Angular
// @param type 			Type (BedBase or Mattress)
// @param product 		Product for modification at the database
router.put('/:type/:id', function(req, res, next) {
	const productI = req.body.product;
	const type = req.params.type;
	const product = {
  		id: productI.id,
  		prize: productI.prize,
  		type: type,
  		sold: 0,
  		img: productI.url,
  		description: productI.description
	}

	const prodIndex = usingList.findIndex( p=> p.id == product.id);

  	if(prodIndex >= 0){
  		usingList.splice(prodIndex,1,product);
  		res.status(200).send(`Edited ${type} ${product.id}`);
  	} else {
  		res.status(403).send('Element does not exist in database');
  	}
});

// Element list. Returns a product list based on its type.
// TODO: Mongoose API for getting all the objects with the same attribute value.
// @param type 			Type (BedBase or Mattress)
router.get('/:type', function(req, res, next) {
	const prodResponse = usingList.map(p => {
		if(p.type == req.params.type){
			return p;
		}
	});

	res.status(200).json(prodResponse);
});

router.get('/'), function(req,res,next) {
	usingList.sort((p1,p2) => {
		if(p1.sold>p2.sold){
			return -1;
		} else if (p1.sold<p2.sold){
			return 1;
		} else {
			return 0;
		}
	} );
	const prodResponse = usingList.slice(0,6);
	res.status(200).json(prodResponse);
}

module.exports = { routes:router,
 				   initFunction: initProductDB,
 				 }
