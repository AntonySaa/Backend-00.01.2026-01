export interface ServerToClientEvents {
  message: (msg: ChatMessage) => void;
  messageDeleted: (msgId: string) => void;
  messageEdited: (msg: { id: string; text: string }) => void;
  historyCleared: (withUserId: string) => void;
  botMessage: (msg: ChatMessage) => void;
  userJoined: (user: string) => void;
  userLeft: (user: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (to: any, text: any) => void;
  setUser: (user: string) => void;
  deleteMessage: (msgId: string) => void;
  editMessage: (msgId: string, newText: string) => void;
  clearHistory: (withUserId: string) => void;
}

export interface SocketData {
  userId: string;
}

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
  edited?: boolean;
}
