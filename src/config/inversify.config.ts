import { Container } from 'inversify';
import { TYPES } from '../types/types';
import { Auth } from '../middleware/auth.middleware';
import { Role } from '../middleware/role.middleware';
import { ApiError } from '../utils/ApiError';
import * as controller from '../Controller';
import * as service from '../Services';

const container = new Container();

// middlewares
container.bind<Auth>(TYPES.Auth).to(Auth);
container.bind<Role>(TYPES.Role).to(Role);

// controllers
container.bind<controller.UserController>(TYPES.UserController).to(controller.UserController);
container.bind<controller.ProductController>(TYPES.ProductController).to(controller.ProductController);
container.bind<controller.CategoryController>(TYPES.CategoryController).to(controller.CategoryController);
container.bind<controller.CouponController>(TYPES.CouponController).to(controller.CouponController)

// services
container.bind<service.UserService>(TYPES.UserService).to(service.UserService);
container.bind<service.ProductService>(TYPES.ProductService).to(service.ProductService);
container.bind<service.CategoryService>(TYPES.CategoryService).to(service.CategoryService);
container.bind<service.CouponService>(TYPES.CouponService).to(service.CouponService);

// utilities
container.bind<ApiError>(ApiError).toSelf();

export default container;
