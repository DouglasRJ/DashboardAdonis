import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Achievement from "App/Models/Achievement";
import MiniGame from "App/Models/MiniGame";
import CreateAchievementValidator from "App/Validators/CreateAchievementValidator";

export default class AchievementController {
  async index() {
    try {
      const achievements = await Achievement.all();
      return achievements;
    } catch (error) {
      return error;
    }
  }

  async show({ params }: HttpContextContract) {
    try {
      const achievementId = params.id;
      const achievement = await Achievement.findByOrFail("id", achievementId);
      return achievement;
    } catch (error) {
      return error;
    }
  }

  async store({ request }: HttpContextContract) {
    try {
      const { miniGameId } = request.all();
      await MiniGame.findByOrFail("id", miniGameId);
      const data = await request.validate(CreateAchievementValidator);
      const achievement = await Achievement.create(data);
      return achievement;
    } catch (error) {
      return error;
    }
  }

  async destroy({ params, request, response }: HttpContextContract) {
    try {
      const achievementId = params.id;
      const achievement = await Achievement.findByOrFail("id", achievementId);
      await achievement.delete();
      return achievement;
    } catch (error) {
      return error;
    }
  }

  async update({ params, request, response }: HttpContextContract) {
    try {
      const achievementId = params.id;
      const achievement = await Achievement.findByOrFail("id", achievementId);
      let { name, description, points } = request.all();
      name == null ? (name = achievement.name) : name;
      description == null
        ? (description = achievement.description)
        : description;
      points == null ? (points = achievement.points) : points;
      await achievement.merge({ name, description, points }).save();
      return achievement;
    } catch (error) {
      return error;
    }
  }
}
