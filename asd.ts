import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Achievement from "./app/Models/Achievement";
import Child from "./app/Models/Child";

export default class ChildrenAChievement extends BaseModel {
  public table = "children_achievements";

  @column({ isPrimary: true })
  public id: number;

  @column({ columnName: "child_id", serializeAs: "childId" })
  public childId: number;

  @belongsTo(() => Child, {
    foreignKey: "child_id",
  })
  public child: BelongsTo<typeof Child>;

  @column({ columnName: "achievement_id", serializeAs: "achievementId" })
  public achievementId: number;

  @belongsTo(() => Achievement, {
    foreignKey: "achievement_id",
  })
  public achievement: BelongsTo<typeof Achievement>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
