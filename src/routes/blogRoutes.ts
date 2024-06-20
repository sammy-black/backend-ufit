import { Router, Request, Response, NextFunction } from 'express';
import BlogController from '../controllers/BlogController';

const routes = Router();

routes.post(
  '/',
  //   authController.protect,
  //   authController.restrictTo(ROLES.ADMIN),
  BlogController.create
);

routes.get(
  '/',
  // authController.protect,
  // authController.restrictTo(ROLES.ADMIN),
  BlogController.getAll
);

routes.get(
    '/:id',
    // authController.protect,
    // authController.restrictTo(ROLES.ADMIN),
    BlogController.getOne
  );

routes.patch(
  '/:id',
  // authController.protect,
  // authController.restrictTo(ROLES.ADMIN),
  BlogController.update
);

routes.delete(
    '/:id',
    // authController.protect,
    // authController.restrictTo(ROLES.ADMIN),
    BlogController.delete
  );

export default routes;
