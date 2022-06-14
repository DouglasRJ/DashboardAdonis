import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Achievement from "App/Models/Achievement";
import MiniGame from "App/Models/MiniGame";
import CreateAchievementValidator from "App/Validators/CreateAchievementValidator";

export default class AchievementController {
  async index() {
    const achievements = await Achievement.all();
    return achievements;
  }

  async show({ params }: HttpContextContract) {
    const achievement = await Achievement.findBy("id", params.id);
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    return achievement;
  }

  async store({ request }: HttpContextContract) {
    const { miniGameId } = request.only(["miniGameId"]);
    if (!(await MiniGame.findBy("id", miniGameId))) {
      throw new Error("MiniGame not found");
    }
    const data = await request.validate(CreateAchievementValidator);
    const achievement = await Achievement.create(data);
    return achievement;
  }

  async destroy({ params }: HttpContextContract) {
    const achievement = await Achievement.findBy("id", params.id);
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    await achievement?.delete();
    return achievement;
  }

  async update({ params, request }: HttpContextContract) {
    const achievement = await Achievement.findBy("id", params.id);
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    let { name, description, points } = request.only([
      "name",
      "description",
      "points",
    ]);
    if (!name && !description && !points) {
      throw new Error("Name or description or points are required");
    }
    name == null ? (name = achievement?.name) : name;
    description == null
      ? (description = achievement?.description)
      : description;
    points == null ? (points = achievement?.points) : points;
    await achievement?.merge({ name, description, points }).save();
    return achievement;
  }
}
