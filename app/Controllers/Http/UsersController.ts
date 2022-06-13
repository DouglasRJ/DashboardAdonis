import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import User from '../../Models/User'

export default class UsersController {
    public async index ({ response }: HttpContextContract) {
        const users = await User.query().preload('children')
        return response.json(users)
    }

    async store({ request, response }: HttpContextContract) {
        try{
            const data = await request.validate(CreateUserValidator)
            const user = User.create(data)
            return user
        } catch(error) {
            return response.badRequest(error.messages.errors[0].message)
        }
    }

    async destroy({ request, response, auth }: HttpContextContract) {
        const { email, password } = request.all()
         try
        {
            await auth.attempt(email, password)
            const user = await User.findByOrFail('email', email)
            await user.delete()
            return user
        } catch {
            return response.badRequest('Email or password invalid')
        }
    }

    async changePassword({ request, response, auth}: HttpContextContract) {
        try
        {
            const { email, last_password, new_password } = request.all()
            await auth.attempt(email, last_password)
            const user = await User.findByOrFail('email', email)

            if(!(await Hash.verify(user.password, last_password))) {
                return response.badRequest('Wrong password')
            }

            user.password = new_password

            await user.save()

            return user
        } catch {
            return response.badRequest('Email or password invalid')
        }
    }

    async show({ params, response }: HttpContextContract) {
        try {
            const id = params.id
            const user = await User.query().where('id', id).preload('children')
            return user
        } catch {
            return response.badRequest('User not found')
        }
    }

    async update({ params, request, response}: HttpContextContract) {
        try {
            const id = params.id
            const user = await User.findByOrFail('id', id)
            let { username, email } = request.all()
            username == null ? username = user.username : username
            email == null ? email = user.email : email
            await user.merge({username, email}).save()
            return user
        }catch {
            return response.badRequest('Invalid data')
        }
    }
}
