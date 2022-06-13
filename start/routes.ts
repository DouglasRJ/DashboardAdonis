/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", () => {
    return { greeting: "Hello world in JSON" };
  });

  Route.resource("users", "UsersController").apiOnly();
  Route.post("users/change_password", "UsersController.changePassword");
  Route.post("login", "LoginController.login");
  Route.resource("child/", "ChildrenController").apiOnly();
  Route.post("child/playMiniGame/:childId", "ChildrenController.playMiniGame");
  Route.post("child/:childId/achievement", "ChildrenController.addAchievement");
  Route.resource("miniGame", "MiniGameController").apiOnly();
  Route.resource("achievement/", "AchievementController").apiOnly();
}).prefix("/api");
