import { checkExact, body} from 'express-validator'

class UserValidator{
    static validateLoginParams(){
        return checkExact([body('email').notEmpty(), body('password').notEmpty()], {message: 'email and password are required'})
    }
}


export default UserValidator;