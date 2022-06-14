import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MiniGame from "../../Models/MiniGame";
import CreateMiniGameValidator from "App/Validators/CreateMiniGameValidator";

export default class MiniGameController {
  async index() {
    const miniGames = MiniGame.query().preload("achievements");
    return miniGames;
  }

  async store({ request }: HttpContextContract) {
    const data = await request.validate(CreateMiniGameValidator);
    const miniGame = await MiniGame.create(data);
    return miniGame;
  }

  async show({ params }: HttpContextContract) {
    const miniGame = await MiniGame.findBy("id", params.id);
    if (!miniGame) {
      throw new Error("MiniGame not found");
    }
    await miniGame?.load("achievements");
    return {
      MiniGame: miniGame,
    };
  }

  async destroy({ params }: HttpContextContract) {
    const miniGame = await MiniGame.findBy("id", params.id);
    if (!miniGame) {
      throw new Error("MiniGame not found");
    }
    await miniGame?.delete();
    return miniGame;
  }

  async update({ params, request }: HttpContextContract) {
    const miniGame = await MiniGame.findBy("id", params.id);
    if (!miniGame) {
      throw new Error("MiniGame not found");
    }
    let { name } = request.only(["name"]);
    if (!name) {
      throw new Error("Name is required");
    }
    if (name == miniGame.name) {
      throw new Error("Name is not changed");
    }
    name == null ? (name = miniGame.name) : name;
    await miniGame.merge({ name }).save();
    return miniGame;
  }
}
