import type ws from "ws";
import { AdvancedWebsocket, AdvancedWebsocketServer } from "../utils/types";

declare module "websockets-events" {
  function useWebSocket(url: string): AdvancedWebsocket;
  function useWebSocketServer(webSocket: ws.WebSocket): AdvancedWebsocketServer;
}
