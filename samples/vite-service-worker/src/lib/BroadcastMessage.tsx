import { BroadcastChannelMember } from 'lib/BroadcastChannelMember.tsx';

// Define a type for individual messages

export type BroadcastMessage = {
  id: string;
  content?: string | boolean | number | object | (string | boolean | number | object)[];
  type?: string;
  source?: BroadcastChannelMember;
  target?: BroadcastChannelMember;
};
