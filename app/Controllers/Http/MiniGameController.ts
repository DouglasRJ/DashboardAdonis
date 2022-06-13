import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MiniGame from '../../Models/MiniGame'
import CreateMiniGameValidator from 'App/Validators/CreateMiniGameValidator'

export default class MiniGameController {
    async index({ response }: HttpContextContract) {
        try {
        const miniGames = MiniGame.query().preload('achievements')
        return miniGames
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async store({ request }: HttpContextContract){
        const data = await request.validate(CreateMiniGameValidator)
        const miniGame = await MiniGame.create(data)
        return miniGame
    }

    async show({ params, response }: HttpContextContract) {
        try {
            const miniGameId = params.id
            const miniGame = await MiniGame.query().where('id', miniGameId).preload('achievements')
            return {
                "MiniGame": miniGame
            }
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async destroy({ params, request, response }: HttpContextContract) {
        try {
            const miniGameId = params.id
            const miniGame = await MiniGame.findByOrFail('id', miniGameId)
            await miniGame.delete()
            return miniGame
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async update({ params, request, response}: HttpContextContract) {
        try {
            const miniGameId = params.id
            const miniGame = await MiniGame.findByOrFail('id', miniGameId)
            let { name } = request.all()
            name == null ? name = miniGame.name : name
            await miniGame.merge({ name }).save()
            return miniGame
        } catch {
            return response.badRequest('Invalid data')
        }
    }
}
