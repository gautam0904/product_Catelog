export const TYPES = {
  //user
  UserService: Symbol.for('UserServices'),
  UserController: Symbol.for('UserController'),

// product
ProductService: Symbol.for('ProductService'),
  ProductController: Symbol.for('ProductController'),

  //category
  CategoryService: Symbol.for('CategoryService'),
  CategoryController: Symbol.for('CategoryController'),

  // coupon
  CouponService: Symbol.for('CouponService'),
  CouponController: Symbol.for('CouponController'),
 
  //middleware
  Auth: Symbol.for('Auth'),
  Role: Symbol.for('Role')
}
