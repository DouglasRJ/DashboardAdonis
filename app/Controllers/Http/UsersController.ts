import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import User from "../../Models/User";

export default class UsersController {
  public async index() {
    const users = await User.query().preload("children");
    return users;
  }

  async store({ request }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator);
    const user = await User.create(data);
    return user;
  }

  async destroy({ request, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);
    if (email == null) {
      throw new Error("Email is required");
    }
    if (password == null) {
      throw new Error("Password is required");
    }
    await auth.attempt(email, password);
    const user = await User.findBy("email", email);
    if (!user) {
      throw new Error("User not found");
    }
    await user?.delete();
    return user;
  }

  async changePassword({ request, auth }: HttpContextContract) {
    const { email, last_password, new_password } = request.only([
      "email",
      "last_password",
      "new_password",
    ]);

    if (email == "") {
      throw new Error("Email is required");
    }
    if (new_password == "") {
      throw new Error("New password is required");
    }
    if (last_password == "") {
      throw new Error("Last password is required");
    }

    await auth.attempt(email, last_password);

    if (new_password == last_password) {
      throw new Error("New password is the same as the last password");
    }
    const user = await User.findBy("email", email);

    if (!user) {
      throw new Error("User not found");
    }
   
    await user?.merge({ password: new_password }).save();
    return user;
  }

  async show({ params }: HttpContextContract) {
    const user = await User.findBy("id", params.id);
    if (!user) throw new Error("User not found");
    await user?.load("children");
    return user;
  }

  async update({ params, request }: HttpContextContract) {
    const user = await User.findBy("id", params.id);

    if (!user) {
      throw new Error("User not found");
    }

    let { username, email } = request.only(["username", "email"]);

    if (username == null && email == null) {
      throw new Error("Username or email is required");
    }
    username == null ? (username = user?.username) : username;
    email == null ? (email = user?.email) : email;

    await user?.merge({ username, email }).save();
    return user;
  }
}
