import { Router, Request, Response, NextFunction } from "express";
import authController from '../controllers/AuthController';
import UserValidator from "../validators/userValidator";

const routes = Router();


routes.post('/register',authController.register)

routes.post('/login', UserValidator.validateLoginParams(),  authController.login)




export  default routes;