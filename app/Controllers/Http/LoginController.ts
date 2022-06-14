import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class LoginController {
  async login({ request, auth }: HttpContextContract) {
    const { email, password } = request.only(["email", "password"]);
    if (email == null) {
      throw new Error("Email is required");
    }
    if (password == null) {
      throw new Error("Password is required");
    }
    if(!(await User.findBy('email', email))) {
        throw new Error("Email is not registered");
    }
    const token = await auth.attempt(email, password);
    return token;
  }
}
