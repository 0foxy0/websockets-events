import type ws from "ws";

export interface AdvancedWebsocket extends WebSocket {
  emitCustomEvent: (eventName: string, payload: unknown) => void;
  onCustomEvent: (eventName: string, callback: EventCallback) => void;
  addCustomEventListener: (
    eventName: string,
    callback: EventCallback
  ) => string;
  removeCustomEventListener: (id: string) => void;
}
export interface AdvancedWebsocketServer extends ws.WebSocket {
  emitCustomEvent: (eventName: string, payload: unknown) => void;
  onCustomEvent: (eventName: string, callback: EventCallback) => void;
  addCustomEventListener: (
    eventName: string,
    callback: EventCallback
  ) => string;
  removeCustomEventListener: (id: string) => void;
}

export interface Event {
  eventName: string;
  callbacks: { id: string; cb: EventCallback }[];
}
export interface ReceivedEvent {
  eventName: string;
  payload: unknown;
}

export type EventCallback = (payload: unknown) => void;
