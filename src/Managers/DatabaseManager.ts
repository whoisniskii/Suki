import { Pool } from 'pg';
import { Suki } from '../Suki';

class DatabaseManager extends Pool {
  client: Suki;

  constructor(client: Suki) {
    super({
      user: client.config.databaseConfig.user,
      host: client.config.databaseConfig.host,
      database: client.config.databaseConfig.database,
      password: client.config.databaseConfig.password,
      port: client.config.databaseConfig.port,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.client = client;
  }

  async connectDatabase(): Promise<void> {
    await this.runQuery(`SELECT NOW() as now`);
    this.client.logger.info('Database successfully connected', 'POSTGRESQL');
  }

  async runQuery(query: string): Promise<any[]> {
    const res = await this.query(query);

    return res.rows;
  }

  async getGuildData(guildId: string) {
    const query = await this.query(`SELECT * FROM guilds WHERE guild_id=$1`, [guildId]);
    const data: GuildData = query.rows[0];

    return data;
  }

  async createGuildData(guildId: string) {
    const guildData = await this.getGuildData(guildId);

    const guildDataObject = {
      forever: false,
    };

    if (!guildData) {
      await this.query(`INSERT INTO guilds (guild_id, guild_data, created_at) VALUES ($1, $2, $3)`, [guildId, guildDataObject, new Date()]);
    }

    return { guild_id: guildId, guild_data: guildDataObject, createdAt: new Date() };
  }

  async deleteGuildData(guildId: string) {
    const guildData = await this.getGuildData(guildId);

    if (!guildData) {
      return;
    }

    await this.query('DELETE FROM guilds WHERE guild_id=$1', [guildId]);
  }

  async createTable(tableData: ITable): Promise<boolean> {
    let textData = ``;

    tableData.columns.map((column: ITableColumn, index: number) => {
      let extraData = ``;

      if (column.isUnique) {
        extraData += `UNIQUE `;
      }

      if (column.required) {
        extraData += `NOT NULL `;
      }

      if (column.default) {
        extraData += `DEFAULT ${column.default}`;
      }

      extraData = extraData.trimEnd();

      if (index === tableData.columns.length - 1) {
        textData += `\t${column.name} ${column.type} ${extraData}\n`;
      } else {
        textData += `\t${column.name} ${column.type} ${extraData},\n`;
      }

      return textData;
    });

    await this.runQuery(`CREATE TABLE IF NOT EXISTS ${tableData.tableName} (\n${textData})`);

    return true;
  }
}

export { DatabaseManager };

interface ITableColumn {
  name: string;
  type: string;
  required: boolean;
  isUnique: boolean;
  primary: boolean;
  default?: string;
}

interface ITable {
  tableName: string;
  createOnConnect: boolean;
  columns: ITableColumn[];
}

export interface GuildInterface {
  database_id?: number;
  guild_id: string;
  guild_data: GuildData;
  created_at: Date;
}

interface GuildData {
  forever: boolean;
}
