import { Pool } from 'pg';
import { Suki } from '../Suki';

class DatabaseManager extends Pool {
  client: Suki;

  constructor(client: Suki) {
    super(client.config.databaseConfig);

    this.client = client;
  }

  async connectDatabase(): Promise<void> {
    await this.query('SELECT NOW() as now');
    this.client.logger.info('Database successfully connected', 'POSTGRESQL');
  }

  async getGuild(guildId: string) {
    const query = await this.query('SELECT * FROM guilds WHERE guild_id=$1', [guildId]);

    return query.rows[0];
  }

  async createGuild(guildId: string) {
    const guildData = await this.getGuild(guildId);

    if (!guildData) {
      await this.query('INSERT INTO guilds (guild_id, created_at) VALUES ($1, $2)', [guildId, new Date()]);
    }

    return { guild_id: guildId, createdAt: new Date() };
  }

  async deleteGuild(guildId: string) {
    const guildData = await this.getGuild(guildId);

    if (!guildData) {
      return;
    }

    await this.query('DELETE FROM guilds WHERE guild_id=$1', [guildId]);
  }

  async getPing() {
    const start = Date.now();
    await this.query('SELECT NOW() as now');

    return Date.now() - start;
  }
}

export { DatabaseManager };
