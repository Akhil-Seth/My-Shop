const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLoggedIn : req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("fs");
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  // if (!image) {
  //   return res.status(422).render('admin/edit-product', {
  //     pageTitle: 'Add Product',
  //     path: '/admin/add-product',
  //     editing: false,
  //     product: {
  //       title: title,
  //       price: price,
  //       description: description
  //     },
  //     errorMess: 'Attached file is not an image.',
  //   });
  // }
  const imageUrl = image.path;
  console.log(imageUrl);
  console.log(image);
  const product = new Product({
    title : title ,
    price : price,
    desc : description,
    imageUrl : imageUrl,
    userId : userId
  });
  console.log(product);
  product
  .save()
  .then( result => {
    return res.redirect('/admin/products');
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) { 
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(products => {
    if (!products) {
      console.log("no products to edit");
      return res.redirect('/');
    }
    console.log(products);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: products,
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;
  const userId = req.user._id;
  if (!updatedImage) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMess: 'Attached file is not an image.',
    });
  }
  Product.
     findById(prodId)
    .then(product => {
      product.title = updatedTitle ;
      product.price = updatedPrice;
      product.desc = updatedDesc ;
      product.imageUrl = updatedImage.path;
      product.userId = userId;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find( { userId : req.user._id})
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isLoggedIn : req.session.isLoggedIn
    });
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId; 
  Product.findByIdAndRemove(prodId)
  .then(result => {
    console.log('DESTROYED PRODUCT');
    res.status(200).json({ message: 'Success!' });
  })
  .catch(err => {
    console.log('Failed');
    res.status(500).json({ message: 'FAILED!' });
  });
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) { 
    return res.redirect('/');
  }
  Product.find()
  .then(products => {
    if (!products) {
      return res.redirect('/');
    }
    console.log(products);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: products,
      isLoggedIn: req.session.isLoggedIn
    });
  })
  .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  }
  );
};