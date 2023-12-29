const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const MaxItems = 2;

exports.getProducts = (req, res, next) => {;
   Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isLoggedIn : req.session.isLoggedIn
    });
  })
  .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

  );
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(products => {
    res.render('shop/product-detail', {
      product: products,
      pageTitle: 'product-Info',
      path: '/products',
      isLoggedIn : req.session.isLoggedIn
    });
  })
  .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getIndex = (req, res, next) => {
  const pageNo = +req.query.page || 1;
  var totalPro;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalPro = numProducts;
      return Product.find()
        .skip((pageNo - 1) * MaxItems)
        .limit(MaxItems);
    })
    .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      totalNo : totalPro,
      hasPreviousPage: pageNo > 1,
      nextPage : pageNo + 1 ,
      previousPage : pageNo - 1,
      currPage : pageNo,
      totalPages : Math.ceil(totalPro / MaxItems)
    });
  })
  .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

  );
};

exports.getCart = (req, res, next) => {
      const products = req.user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isLoggedIn : req.session.isLoggedIn
      });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  }).catch (err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.getOrders = (req, res, next) => {
  Cart.find({ 'userId': req.user._id })
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isLoggedIn : req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // Cart.orderList()
  // .then(orders => {
  //   console.log(orders);
  //   res.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders: orders
  //   });
  // })
  // .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const products = req.user.cart.items
  // req.user
  //   .populate('cart.items.productId')
  //   .execPopulate()
  //   .then(user => {
  //     const products = user.cart.items.map(i => {
  //       return { quantity: i.quantity, product: { ...i.productId._doc } };
  //     });
      const order = new Cart({
          product: req.user.cart.items,
          email: req.user.email,
          userId: req.user
      });
      order.save().
      then(result => {
        req.user.clearCart();
        res.redirect('/orders');
      }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};
