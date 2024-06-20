import { Router, Request, Response, NextFunction } from "express";
import travelPackageController from '../controllers/TravelPackageController'
import authController from "../controllers/AuthController";
import { ROLES } from "../utils/enums";
import TravelPackageValidator from '../validators/travelPackagesValidator'

const routes = Router();


routes.post('/', authController.protect, authController.restrictTo(ROLES.ADMIN), TravelPackageValidator.validateCreateParams(), travelPackageController.create)
routes.get('/', authController.protect, authController.restrictTo(ROLES.ADMIN, ROLES.USER), travelPackageController.getAll)
routes.get('/:id', authController.protect, authController.restrictTo(ROLES.ADMIN, ROLES.USER), travelPackageController.getOne)

export default routes;
