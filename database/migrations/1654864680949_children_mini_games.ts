import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'children_mini_games'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('child_id').unsigned().references('children.id').onDelete('CASCADE').index('children_id')
      table.integer('mini_game_id').unsigned().references('mini_games.id').onDelete('CASCADE').index('mini_game_id')
      table.unique(['child_id', 'mini_game_id'])
      table.float('play_time')
      table.timestamp('last_access', { useTz: true })
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
