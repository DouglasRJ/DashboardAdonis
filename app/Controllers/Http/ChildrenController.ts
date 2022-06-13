import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Child from 'App/Models/Child'
import MiniGame from 'App/Models/MiniGame'
import User from 'App/Models/User'
import ChildrenMiniGame from 'App/Models/ChildrenMiniGame'
import Achievement from 'App/Models/Achievement'
import ChildrenMiniGameAchievement from 'App/Models/ChildrenMiniGameAchievement'
import CreateChildValidator from 'App/Validators/CreateChildValidator'

export default class ChildrenController {
    async index({ request, response }: HttpContextContract) {
        try {
            const children = Child.all()
            return children
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async show({ params, request, response }: HttpContextContract) {
        try {
            const childId = params.id
            const child = await Child.findByOrFail('id', childId)
            const childrenMiniGame = await ChildrenMiniGame.query().where('child_id', childId)
            const miniGame = await MiniGame.query().whereIn('id', childrenMiniGame.map(childrenMiniGame => childrenMiniGame.miniGameId))
            const childrenMiniGameAchievement = await ChildrenMiniGameAchievement.query().whereIn('children_mini_game_id', childrenMiniGame.map(childrenMiniGame => childrenMiniGame.id))
            const achievement = await Achievement.query().whereIn('id', childrenMiniGameAchievement.map( childrenMiniGameAchievement => childrenMiniGameAchievement.achievementId))

            // const teste = await ChildrenMiniGameAchievement.query().where('children_mini_game_id', 
            //     ChildrenMiniGame.query().select('id').where('child_id', childId))

            return {
                "Child": child,
                "MiniGames": miniGame,
                "Achievements": achievement
            }
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async store ({  request, response }: HttpContextContract) {
        try {
            const { userId } = request.all()
            await User.findByOrFail('id', userId)
            const data = await request.validate(CreateChildValidator)
            const child = await Child.create(data)
            return child
        } catch(error) {
            return response.badRequest(error.messages.errors[0].message)
        }
    }

    async destroy({ params, request, response }: HttpContextContract) {
        try {
            const { userId } = request.all()
            await User.findByOrFail('id', userId)
            const childId = params.id
            const child = await Child.findByOrFail('id', childId)
            await child.delete()
            return child
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async update({ params, request, response }: HttpContextContract) {
        try {
            const { userId } = request.all()
            let { name, birth_date } = request.all()
            await User.findByOrFail('id', userId)
            const childId = params.id
            const child = await Child.findByOrFail('id', childId)
            name == null? name = child.name : name
            birth_date == null? birth_date = child.birth_date : birth_date

            await child.merge({ name, birth_date }).save()
            return child         
            
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async playMiniGame({ params, request, response }: HttpContextContract) {
        try { 
            const childId = params.childId
            await Child.findByOrFail('id', childId)
            const { miniGameId, play_time } = request.all()
            await MiniGame.findByOrFail('id', miniGameId)
            const childrenMiniGame = await ChildrenMiniGame.create({
                childId,
                miniGameId,
                play_time
            })
            User.query()
            await childrenMiniGame.save()
            return childrenMiniGame
        } catch {
            return response.badRequest('Invalid data')
        }
    }

    async addAchievement({ params, request }:HttpContextContract) {
        const childId = params.childId
        await Child.findByOrFail('id', childId)
        const { miniGameId, achievementId } = request.all()
        await MiniGame.findByOrFail('id', miniGameId)
        await Achievement.findByOrFail('id', achievementId)

        const childrenMiniGame = await ChildrenMiniGame.query().select('id').where('child_id', childId).where('mini_game_id', miniGameId)
        const childrenMiniGameId = childrenMiniGame[0].id


        const childrenMiniGameAchievement = await ChildrenMiniGameAchievement.create({
            childrenMiniGameId,
            achievementId
        })

        return childrenMiniGameAchievement
    }
}
