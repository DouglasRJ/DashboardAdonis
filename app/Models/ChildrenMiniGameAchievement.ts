import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ChildrenMiniGame from './ChildrenMiniGame'
import Achievement from './Achievement'

export default class ChildrenMiniGameAchievement extends BaseModel {
  public table = 'children_mini_game_achievements'
  @column({ isPrimary: true })
  public id: number

  @column( { columnName: 'children_mini_game_id', serializeAs: 'childrenMiniGameId' })
  public childrenMiniGameId: number

  @belongsTo(() => ChildrenMiniGame, {
    foreignKey: 'children_mini_game_id',
    })
  public childrenMiniGame: BelongsTo<typeof ChildrenMiniGame>

  @column( { columnName: 'achievement_id', serializeAs: 'achievementId' })
  public achievementId: number

  @belongsTo(() => Achievement, {
    foreignKey: 'achievement_id',
    })
  public achievement: BelongsTo<typeof Achievement>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
