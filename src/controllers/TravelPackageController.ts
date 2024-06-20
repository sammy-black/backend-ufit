import { Request, Response, NextFunction  } from 'express';
import catchAsync from "../utils/catchAsync";
import TravelPackage from "../model/travelPackageModel";
import { matchedData, validationResult } from 'express-validator';
import AppError from '../utils/AppError';

class TravelPackageController{

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const result = validationResult(req);

            if(!result){
                return next(new AppError('some erorrs here', 401))
            }
            const data = matchedData(req);


            const travelPackage = await TravelPackage.create(data);


            res.status(201).json({
                object: travelPackage
            })
    })

    getAll = catchAsync(async () => {

    })

    getOne = catchAsync(async () => {

    })

    delete =  catchAsync(async () => {

    })

    update = catchAsync(async () => {

    })
}


export default new TravelPackageController();