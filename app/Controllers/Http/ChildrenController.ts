import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Child from "App/Models/Child";
import MiniGame from "App/Models/MiniGame";
import User from "App/Models/User";
import ChildrenMiniGame from "App/Models/ChildrenMiniGame";
import Achievement from "App/Models/Achievement";

import CreateChildValidator from "App/Validators/CreateChildValidator";
import ChildrenAchievement from "App/Models/ChildrenAchievement";

export default class ChildrenController {
  async index() {
    const children = await Child.all();
    return children;
  }

  async show({ params }: HttpContextContract) {
    const child = await Child.findBy("id", params.id);
    if (!child) {
      throw new Error("Child not found");
    }
    await child?.load("miniGames");
    await child?.load("achievement");
    return child;
  }

  async store({ request }: HttpContextContract) {
    const data = await request.validate(CreateChildValidator);
    const child = await Child.create(data);
    return child;
  }

  async destroy({ params, request }: HttpContextContract) {
    const { userId } = request.only(["userId"]);

    if (!(await User.findBy("id", userId))) {
      throw new Error("User not found");
    }
    const child = await Child.findBy("id", params.id);
    if (!child) {
      throw new Error("Child not found");
    }
    await child?.delete();
    return child;
  }

  async update({ params, request }: HttpContextContract) {
    const { userId } = request.only(["userId"]);
    let { name, birth_date } = request.only(["name", "birth_date"]);

    if (!(await User.findBy("id", userId))) {
      throw new Error("User not found");
    }

    const child = await Child.findBy("id", params.id);
    if (!child) {
      throw new Error("Child not found");
    }
    name == null ? (name = child.name) : name;
    if (name == child.name) {
      throw new Error("Name is not changed");
    }
    birth_date == null ? (birth_date = child.birth_date) : birth_date;
    if (birth_date == child.birth_date) {
      throw new Error("Birth date is not changed");
    }
    await child.merge({ name, birth_date }).save();
    return child;
  }

  async playMiniGame({ params, request }: HttpContextContract) {
    const childId = params.id;
    if(!(await Child.findBy("id", childId))) {
      throw new Error("Child not found");
    }
    const { miniGameId, play_time } = request.only(["miniGameId", "play_time"]);
    if (!(await MiniGame.findBy("id", miniGameId))) {
      throw new Error("MiniGame not found");
    }
    const childrenMiniGame = await ChildrenMiniGame.create({
      childId,
      miniGameId,
      play_time,
    });
    await childrenMiniGame.save();
    return childrenMiniGame;
  }

  async addAchievement({ params, request }: HttpContextContract) {
    const childId = params.childId;
    if (!(await Child.findBy("id", childId))) {
      throw new Error("Child not found");
    }
    const { miniGameId, achievementId } = request.only([
      "miniGameId",
      "achievementId",
    ]);
    if (!(await MiniGame.findBy("id", miniGameId))) {
      throw new Error("MiniGame not found");
    }
    if (!(await Achievement.findBy("id", achievementId))) {
      throw new Error("Achievement not found");
    }
    const childrenAchievement = await ChildrenAchievement.create({
      childId,
      achievementId,
    });
    return childrenAchievement;
  }
}
