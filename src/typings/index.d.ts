import 'vulkava';

declare module 'vulkava' {
    export interface Player {
      lastPlayingMsgID?: string;
      reconnect?: boolean;
    }
  }