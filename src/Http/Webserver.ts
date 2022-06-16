import { verifyKeyMiddleware } from 'discord-interactions';
import { APIInteraction, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionResponseType, InteractionType } from 'discord.js';
import express from 'express';
import { Suki } from '../Suki';

export class SlashCommandsWebServer {
  client: Suki;

  constructor(client: Suki) {
    this.client = client;
  }

  startWebserver() {
    const app = express();
    app.get('/', (_, res) => res.send('Alive'));

    app.post('/interactions', verifyKeyMiddleware(this.client.config.interactions.publicKey), (request, response) => {
      const interaction = request.body as APIInteraction;

      switch (interaction.type) {
        case InteractionType.Ping:
          response.status(200).send({ type: InteractionResponseType.Pong });
          break;

        case InteractionType.ApplicationCommand:
        case InteractionType.ApplicationCommandAutocomplete: {
          const valid = this.#emitEventToClient(interaction);
          if (!valid) response.status(400).send({ error: 'Unknown Type' });
          break;
        }

        default:
          response.status(400).send({ error: 'Unknown Type' });
      }
    });

    app.listen(this.client.config.interactions.port);
    this.client.logger.info(`Slash Commands Web Server started on port ${this.client.config.interactions.port}.`, 'WEBSERVER');
  }

  #emitEventToClient(data: APIInteraction) {
    switch (data.type) {
      case InteractionType.ApplicationCommandAutocomplete:
        // @ts-expect-error Constructor is protected
        this.client.emit('interactionCreate', new AutocompleteInteraction(this.client, data));
        return true;

      case InteractionType.ApplicationCommand: {
        switch (data.data.type) {
          case ApplicationCommandType.ChatInput:
            // @ts-expect-error Constructor is protected
            this.client.emit('interactionCreate', new ChatInputCommandInteraction(this.client, data));
            return true;

          default:
            return false;
        }
      }

      default:
        return false;
    }
  }
}
