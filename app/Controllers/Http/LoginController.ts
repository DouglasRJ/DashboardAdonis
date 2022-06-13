import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
     async login({ request, response, auth }: HttpContextContract) {
         try{
            const { email, password } = request.all()
            const token = await auth.attempt(email, password)
            return token;
        } catch(error) {
            return response.badRequest(error.responseText)
        }

    }
}
