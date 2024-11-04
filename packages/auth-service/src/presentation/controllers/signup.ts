import { badRequest, serverError } from '../helpers/http-helper'
import { MissingParamError, InvalidParamError } from "../errors"
import type { Controller, HttpResponse, HttpRequest, EmailValidator } from "../protocols/index"

export class SignUpController implements Controller{
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }

    handle (httpRequest : HttpRequest): HttpResponse {
        try{
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
 
            for (const field of requiredFields) {
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }

            const { email, password, passwordConfirmation } = httpRequest.body as {
                name: string;
                email: string;
                password: string;
                passwordConfirmation: string;
            };

            if(password !== passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid = this.emailValidator.isValid(email)
            if(!isValid){
                return badRequest(new InvalidParamError('email'))
            }

            return {
                statusCode: 200,
                body: {message: "Success"}
            }
        }catch(error){
            return serverError()
        }
    } 
}