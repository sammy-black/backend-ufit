import { checkExact, body} from 'express-validator'

class TravelPackageValidator{
    static validateCreateParams(){
        return checkExact([body('title').notEmpty(), body('description').notEmpty(),body('destination').notEmpty(),body('price').notEmpty(),body('startDate').notEmpty(), body('endDate').notEmpty()])
    }
}


export default TravelPackageValidator;