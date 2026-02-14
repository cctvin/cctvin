
export enum ChannelType {
  VIDEO = 'VIDEO',
  STATIC = 'STATIC',
  AI_GEN = 'AI_GEN',
  VEO = 'VEO'
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  src?: string;
  description?: string;
}

export interface TVState {
  isPowerOn: boolean;
  currentChannelIndex: number;
  volume: number;
  isChanging: boolean;
  brightness: number;
}
