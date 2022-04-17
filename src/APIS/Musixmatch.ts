import SukiClient from '../SukiClient';

const BASE_URL = 'https://api.musixmatch.com/ws/1.1/';
export default class MusixMatch {
  client: SukiClient;
  apiKey: string;

  constructor(apiKey: string, client: SukiClient) {
    this.apiKey = apiKey;
    this.client = client;
  }

  async searchTrack(params: string, artist: string) {
    const result = await this.client.request(`${BASE_URL}track.search?q_track=${params}&q_artist=${artist}&apikey=${this.apiKey}`)
      .then((res => res.body.json()));

    if(!result.message.body.track_list.length) return null;

    return result.message.body.track_list[0].track;
  }
}