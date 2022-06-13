import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Child from "./Child";
import MiniGame from "./MiniGame";
import Achievement from "./Achievement";

export default class ChildrenMiniGame extends BaseModel {
  public static table = "children_mini_games";

  @column({ isPrimary: true })
  public id: number;

  @column({ columnName: "child_id", serializeAs: "childId" })
  public childId: number;

  @belongsTo(() => Child, {
    foreignKey: "child_id",
  })
  public child: BelongsTo<typeof Child>;

  @column({ columnName: "mini_game_id", serializeAs: "miniGameId" })
  public miniGameId: number;

  @belongsTo(() => MiniGame, {
    foreignKey: "mini_game_id",
  })
  public miniGame: BelongsTo<typeof MiniGame>;

  @column()
  public play_time: number;

  @column.dateTime({ autoCreate: true })
  public lastAccess: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => Achievement, {
    pivotTable: "children_mini_game_achievements",
    localKey: "id",
    pivotForeignKey: "children_mini_game_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "achievement_id",
    pivotTimestamps: true,
    pivotColumns: ["child_id"],
  })
  public achievements: ManyToMany<typeof Achievement>;
}
