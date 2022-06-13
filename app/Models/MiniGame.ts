import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Achievement from "./Achievement";
import Child from "./Child";

export default class MiniGame extends BaseModel {
  @hasMany(() => Achievement)
  public achievements: HasMany<typeof Achievement>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => Child, {
    pivotTable: "children_mini_games",
    localKey: "id",
    pivotForeignKey: "mini_game_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "child_id ",
    pivotTimestamps: true,
    pivotColumns: ["play_time", "last_access"],
  })
  public Children: ManyToMany<typeof Child>;
}
