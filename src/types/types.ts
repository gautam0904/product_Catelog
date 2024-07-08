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
 
  //middleware
  Auth: Symbol.for('Auth'),
  Role: Symbol.for('Role')
}
