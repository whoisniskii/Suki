import { SukiClient } from '../SukiClient';

const BASE_URL = 'https://api.musixmatch.com/ws/1.1';

interface MatchTrackOptions {
  track: string;
  artist: string;
  album?: string;
}

class MusixMatch {
  client: SukiClient;
  apiKey: string;

  constructor(apiKey: string, client: SukiClient) {
    this.apiKey = apiKey;
    this.client = client;
  }

  async matchTrack(options: MatchTrackOptions) {
    const req = await this.client
      .request(`${BASE_URL}/matcher.track.get?q_track=${encodeURIComponent(options.track)}&q_artist=${encodeURIComponent(options.artist)}&apikey=${this.apiKey}`)
      .then(res => res.body.json());

    if (!req.message.body) return null;

    return req.message.body.track;
  }

  async getLyrics(id: string) {
    const req = await this.client.request(`${BASE_URL}/track.lyrics.get?commontrack_id=${id}&apikey=${this.apiKey}`).then(res => res.body.json());

    if (!req.message.body) return null;

    return req.message.body.lyrics;
  }
}

export { MusixMatch };
