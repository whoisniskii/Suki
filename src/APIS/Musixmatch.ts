import SukiClient from '../SukiClient';

const BASE_URL = 'https://api.musixmatch.com/ws/1.1/';
export default class MusixMatch {
  client: SukiClient;
  apiKey: string;

  constructor(apiKey: string, client: SukiClient) {
    this.apiKey = apiKey;
    this.client = client;
  }

  async getTrack(params: string) {
    const result = await this.client.request(`${BASE_URL}track.get?track_isrc=${params}&apikey=${this.apiKey}`)
      .then((res => res.body.json()));

    if(!result.message.body.track) return null;

    return result.message.body.track;
  }

  async searchTrack(params: string, artist: string) {
    const result = await this.client.request(`${BASE_URL}track.search?q_track=${params}&q_artist=${artist}&apikey=${this.apiKey}`)
      .then((res => res.body.json()));

    if(!result.message.body.track_list.length) return null;

    return result.message.body.track_list[0].track;
  }

  async getLyrics(params: string) {
    const result = await this.client.request(`${BASE_URL}track.lyrics.get?track_id=${params}&apikey=${this.apiKey}`)
      .then((res => res.body.json()));

    if(!result.message.body.lyrics) return null;

    return result.message.body.lyrics;
  }
}