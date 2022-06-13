import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import MiniGame from './MiniGame'

export default class Child extends BaseModel {
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public birth_date: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => MiniGame, {
    pivotTable: 'children_mini_games',
    localKey: 'id',
    pivotForeignKey: 'child_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'mini_game_id',
    pivotTimestamps: true,
    pivotColumns: ['play_time', 'last_access']
  })
  public miniGames: ManyToMany<typeof MiniGame>
}
