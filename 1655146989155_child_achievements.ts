import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "children_achievements";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("child_id")
        .unsigned()
        .references("children.id")
        .onDelete("CASCADE")
      table
        .integer("achievement_id")
        .unsigned()
        .references("achievements.id")
        .onDelete("CASCADE")
        .index("achievement_id");
      table.unique(["child_id", "achievement_id"]);
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
