
import jwt from 'jsonwebtoken'
import User from '../model/userModel';
import { CookieOptions, Response, Request, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { matchedData, validationResult } from 'express-validator';
import AppError from '../utils/AppError';
import { ROLES } from '../utils/enums';
import jwtVerifyPromisified from '../utils/promisedJwtVerification';

class AuthController{
    #signToken(userId: string){
        return jwt.sign({sub: userId}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    }

    #signIn(user: IUserReq, statusCode: number, res: Response){
        const token = this.#signToken(user._id);

        const cookieOptions: CookieOptions = {
            signed: true,
            expires: new Date(
              Date.now() +
                parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          };

          if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

          res.cookie('jwt', token, cookieOptions);

          const newUser = user.toJSON();


          res.status(statusCode).json({object: newUser})
    }

    register =  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        let {firstName, lastName, email, password, phoneNumber, role} = req.body
            role = role ?? ROLES.USER
        const user : IUserReq =  await User.create({firstName, lastName, email, password, phoneNumber, role})

        this.#signIn(user, 201, res)
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if(!result){
            return next(new AppError('invalid email or password', 400));
        }

        const {email, password } = matchedData(req);

        const user = await User.findOne({email}).select('+password');

        if(!user || !(await user.comparePassword(password, user.password))){
            return next(new AppError('invalid email or password', 400))
        }

        this.#signIn(user, 200, res)
    })

    protect = catchAsync(
        async (req: IUserReq, _res: Response, next: NextFunction) => {
          const jwtToken = req.signedCookies.jwt;
    
          if (!jwtToken) {
            return next(new AppError('Please log in to get access', 401));
          }
    
          const jwsPayload = (await jwtVerifyPromisified(
            jwtToken,
            process.env.JWT_SECRET
          )) as { userId: string };
    
          const loggedInUser = await User.findById(jwsPayload.userId);
    
          if (!loggedInUser) {
            return next(new AppError('User with this token does not exist', 401));
          }
    
          //TODO: Check if password has been changed.
    
          req.user = loggedInUser;
    
          next();
        }
      );
    
      restrictTo = (...roles: IROLES[]) => (
        req: IUserReq,
        _res: Response,
        next: NextFunction
      ) => {
        if (!roles.includes(req.user.role)) {
          next(
            new AppError('You do not have permission to perform this action', 403)
          );
        }
        next();
      };

    
}

export default new AuthController()