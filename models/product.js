// // const Cart = require('./cart');
// // const fs = require('fs');
// // const path = require('path');

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// // module.exports = class Product {
// //   constructor(id, title, imageUrl, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageUrl = imageUrl;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     getProductsFromFile(products => {
// //       if (this.id) {
// //         const existingProductIndex = products.findIndex(
// //           prod => prod.id === this.id
// //         );
// //         const updatedProducts = [...products];
// //         updatedProducts[existingProductIndex] = this;
// //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //           console.log(err);
// //         });
// //       } else {
// //         this.id = Math.random().toString();
// //         products.push(this);
// //         fs.writeFile(p, JSON.stringify(products), err => {
// //           console.log(err);
// //         });
// //       }
// //     });
// //   }

// //   static deleteById(id) {
// //     getProductsFromFile(products => {
// //       const product = products.find(prod => prod.id === id);
// //       const updatedProducts = products.filter(prod => prod.id !== id);
// //       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //         if (!err) {
// //           Cart.deleteProduct(id, product.price);
// //         }
// //       });
// //     });
// //   }

// //   static fetchAll(cb) {
// //     getProductsFromFile(cb);
// //   }

// //   static findById(id, cb) {
// //     getProductsFromFile(products => {
// //       const product = products.find(p => p.id === id);
// //       cb(product);
// //     });
// //   }
// // };


// const mongoDb= require('mongodb');
// const getDB = require('../util/database').getDB;

// module.exports = class Product {
//   constructor( title, imageUrl, description, price , id , userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this.id = id ;
//     this.userId= userId;
//   }

//   save() {
//     const db = getDB();
//     let dbOp;
//     console.log(this);
//     if (this.id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: new mongoDb.ObjectId(this.id) }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(id) {
//     const db = getDB();
//       return db
//         .collection('products')
//         .deleteOne({ _id: new mongoDb.ObjectId(id) })
//         .then(result => {
//         })
//         .catch(err => {
//           console.log(err);
//         });
//   }

//   static fetchAll() {
//     const db = getDB();
//     return db.collection('products')
//     .find()
//     .toArray()
//     .then( result => {
      
//       return result;
//     })
//     .catch( err => {
//       console.log(err);
//     });
//   }

//   static findById(proId) {
//     const db = getDB();
//     return db.collection('products')
//     .find({_id : new mongoDb.ObjectId(proId)})
//     .next()
//     .then( result => {
//       return result;
//     })
//     .catch( err => {
//       console.log(err);
//     });
//   }
// };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  desc : {
    type : String,
    required : true
  },
  imageUrl : {
    type : String,
    required : true
  },
  id : {
    type : String,
    required : false
  },
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true
  }
})

module.exports = mongoose.model('Product' ,productSchema);
