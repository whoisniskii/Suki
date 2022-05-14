import { SukiClient } from '../SukiClient';

const BASE_URL = 'https://api.musixmatch.com/ws/1.1';
class MusixMatch {
  client: SukiClient;
  apiKey: string;

  constructor(apiKey: string, client: SukiClient) {
    this.apiKey = apiKey;
    this.client = client;
  }

  async getTrack(params: string) {
    const result = await this.client.request(`${BASE_URL}/track.get?track_isrc=${params}&apikey=${this.apiKey}`).then(res => res.body.json());

    if (!result.message.body.track) return null;

    return result.message.body.track;
  }

  async matchLyrics(options: GetLyricsOptions) {
    const req = await this.client
      .request(`${BASE_URL}/matcher.lyrics.get?q_track=${encodeURIComponent(options.track)}&q_artist=${encodeURIComponent(options.artist)}&apikey=${this.apiKey}`)
      .then(res => res.body.json());

    if (!req.message.body) return null;

    return req.message.body.lyrics;
  }
}

export interface GetLyricsOptions {
  track: string;
  artist: string;
  isrc?: string;
}

export { MusixMatch };
