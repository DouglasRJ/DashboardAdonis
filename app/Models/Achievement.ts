import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Child from "./Child";

export default class Achievement extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public miniGameId: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public points: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => Child, {
    pivotTable: "children_achievements",
    localKey: "id",
    pivotForeignKey: "achievement_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "child_id",
    pivotTimestamps: true,
    pivotColumns: ["mini_game_id"],
  })
  public child: ManyToMany<typeof Child>;
}
