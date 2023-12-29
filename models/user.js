// // const mongoDb= require('mongodb');
// // const getDB = require('../util/database').getDB;
// // const ObjectId = mongoDb.ObjectId;

// // class User {
// //   constructor(username, email, cart, id) {
// //     this.name = username;
// //     this.email = email;
// //     this.cart = cart; 
// //     this._id = id;
// //   }


// //   save() {
// //     const db = getDB();
// //     return db.collection('users').insertOne(this);
// //   }

// //   addToCart(product) {
// //     const cartProductIndex = this.cart.items.findIndex(cp => {
// //       return cp.productId == product.id;
// //     });
// //     let newQuantity = 1;
// //     const updatedCartItems = [...this.cart.items];

// //     if (cartProductIndex >= 0) {
// //       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// //       updatedCartItems[cartProductIndex].quantity = newQuantity;
// //     } else {
// //       updatedCartItems.push({
// //         productId: new ObjectId(product._id),
// //         quantity: newQuantity
// //       });
// //     }
// //     const updatedCart = {
// //       items: updatedCartItems
// //     };
// //     const db = getDB();
// //     return db
// //       .collection('users')
// //       .updateOne(
// //         { _id: new ObjectId(this._id) },
// //         { $set: { cart: updatedCart } }
// //       );
// //   }

// //   static findById(userId) {
// //     const db = getDB();
// //     return db.collection('users')
// //       .findOne({ _id: new ObjectId(userId) })
// //       .then(user => {
// //         return user;
// //       })
// //       .catch(err => {
// //         console.log(err);
// //       });
// //   }

// //   getCart() {
// //     const db = getDB();
// //     const productIds = this.cart.items.map(i => {
// //       return i.productId;
// //     });
// //     return db
// //       .collection('products')
// //       .find({ _id: { $in: productIds } })
// //       .toArray()
// //       .then(products => {
// //         return products.map(p => {
// //           return {
// //             ...p,
// //             quantity: this.cart.items.find(i => {
// //               return i.productId.toString() === p._id.toString();
// //             }).quantity
// //           };
// //         });
// //       });
// //   }
// // }

// // module.exports = User;

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDB;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   findProdById(prodId) {
//     console.log("f");
//     console.log(this.cart);
//     return 0;
//   }

//   addToCart(product) {
//         // const cartProductIndex = this.findProdById(product._id);
//         // let newQuantity = 1;
//         // const updatedCartItems = [...this.cart];
    
//         // if (cartProductIndex >= 0) {
//         //   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//         //   updatedCartItems[cartProductIndex].quantity = newQuantity;
//         // } else {
//         //   updatedCartItems.push({
//         //     productId: new ObjectId(product._id),
//         //     quantity: newQuantity
//         //   });
//         // }
//         // const updatedCart = {
//         //   items: updatedCartItems
//         // };
//         // const db = getDb();
//         // return db
//         //   .collection('users')
//         //   .updateOne(
//         //     { _id: new ObjectId(this._id) },
//         //     { $set: { cart: updatedCart } }
//         //   );
//       }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId == p._id;
//             }).quantity
//           };
//         });
//       });
//   }

//   // deleteItemFromCart(productId) {
//   //   const updatedCartItems = this.cart.items.filter(item => {
//   //     return item.productId.toString() !== productId.toString();
//   //   });
//   //   const db = getDb();
//   //   return db
//   //     .collection('users')
//   //     .updateOne(
//   //       { _id: new ObjectId(this._id) },
//   //       { $set: { cart: { items: updatedCartItems } } }
//   //     );
//   // }

//   // addOrder() {
//   //   const db = getDb();
//   //   return this.getCart()
//   //     .then(products => {
//   //       const order = {
//   //         items: products,
//   //         user: {
//   //           _id: new ObjectId(this._id),
//   //           name: this.name
//   //         }
//   //       };
//   //       return db.collection('orders').insertOne(order);
//   //     })
//   //     .then(result => {
//   //       this.cart = { items: [] };
//   //       return db
//   //         .collection('users')
//   //         .updateOne(
//   //           { _id: new ObjectId(this._id) },
//   //           { $set: { cart: { items: [] } } }
//   //         );
//   //     });
//   // }

//   // getOrders() {
//   //   const db = getDB();
//   //   // return db.collection('orders').
//   // }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title : { type: String, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        title : product.title ,
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };

  userSchema.methods.removeFromCart = function(prodId) {
    const upList = [];
    for(let i=0 ;i<  this.cart.items.length ; i++) {
      if(String(this.cart.items[i].productId) !== String(prodId)){
        console.log(String(this.cart.items[i].productId));
        console.log(String(prodId));
        upList.push(this.cart.items[i]);
      }
    }
    // const updatedCart = this.cart.items.filter(item => {
    //     console.log(item.productId);
    //     console.log(productId);
    //     return item.productId.toString !== productId.toString();
    // });
    // console.log(updatedCart);
    this.cart.items =upList;
    return this.save();
  }

  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = mongoose.model('User', userSchema);