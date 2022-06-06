import { Pool, QueryResult } from 'pg';
import GuildTable from '../Database/tables/guilds.json';
import { SukiClient } from '../SukiClient';

class DatabaseManager extends Pool {
  client: SukiClient;

  constructor(client: SukiClient) {
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

  async createRequiredTables() {
    await this.createTable(GuildTable);
  }

  async runQuery(query: string): Promise<any[]> {
    const res: QueryResult = await this.query(query);

    return res.rows;
  }

  async getGuildData(guildId: string) {
    const query: QueryResult = await this.query(`SELECT * FROM guilds WHERE guild_id=$1`, [guildId]);
    const data: GuildData | undefined = query.rows[0];

    return data;
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
