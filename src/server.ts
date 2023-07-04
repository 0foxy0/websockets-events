import { createUUID } from "./utils/helper";
import {
  EventCallback,
  Event,
  ReceivedEvent,
  AdvancedWebsocketServer,
} from "./utils/types";
import { WebSocket } from "ws";

export const useWebSocketServer = (webSocket: WebSocket) => {
  const ws = webSocket as AdvancedWebsocketServer;

  ws.emitCustomEvent = function (eventName: string, payload: unknown) {
    this.send(JSON.stringify({ eventName, payload }));
  };

  const events: Event[] = [];

  ws.addCustomEventListener = function (
    eventName: string,
    callback: EventCallback
  ) {
    const fnEventIndex = events.findIndex((e) => e.eventName === eventName);
    const newCallback = { id: createUUID(), cb: callback };

    if (fnEventIndex !== -1) {
      events[fnEventIndex].callbacks.push(newCallback);
    } else {
      events.push({ eventName, callbacks: [newCallback] });
    }

    ws.onmessage = (event) => {
      try {
        const parsedData: Partial<ReceivedEvent> = JSON.parse(
          event.data.toString()
        );
        const receivedEventIndex = events.findIndex(
          (e) => e.eventName === parsedData?.eventName
        );

        if (
          !parsedData?.eventName ||
          !parsedData?.payload ||
          receivedEventIndex === -1
        )
          return;

        events[receivedEventIndex].callbacks.forEach(({ cb }) =>
          cb(parsedData.payload)
        );
      } catch (err) {
        return;
      }
    };

    return newCallback.id;
  };

  ws.removeCustomEventListener = function (id: string) {
    const eventIndex = events.findIndex((e) =>
      e.callbacks.some((cb) => cb.id === id)
    );
    if (eventIndex === -1) return;

    const callbackIndex = events[eventIndex].callbacks.findIndex(
      (cb) => cb.id === id
    );
    events[eventIndex].callbacks.splice(callbackIndex, 1);

    ws.onmessage = (event) => {
      try {
        const parsedData: Partial<ReceivedEvent> = JSON.parse(
          event.data.toString()
        );
        const receivedEventIndex = events.findIndex(
          (e) => e.eventName === parsedData?.eventName
        );

        if (
          !parsedData?.eventName ||
          !parsedData?.payload ||
          receivedEventIndex === -1
        )
          return;

        events[receivedEventIndex].callbacks.forEach(({ cb }) =>
          cb(parsedData.payload)
        );
      } catch (err) {
        return;
      }
    };
  };

  ws.onCustomEvent = function (eventName: string, callback: EventCallback) {
    const fnEventIndex = events.findIndex((e) => e.eventName === eventName);
    const newCallback = { id: createUUID(), cb: callback };

    if (fnEventIndex !== -1) {
      events[fnEventIndex].callbacks = [newCallback];
    } else {
      events.push({ eventName, callbacks: [newCallback] });
    }

    ws.onmessage = (event) => {
      try {
        const parsedData: Partial<ReceivedEvent> = JSON.parse(
          event.data.toString()
        );
        const receivedEventIndex = events.findIndex(
          (e) => e.eventName === parsedData?.eventName
        );

        if (
          !parsedData?.eventName ||
          !parsedData?.payload ||
          receivedEventIndex === -1
        )
          return;

        events[receivedEventIndex].callbacks.forEach(({ cb }) =>
          cb(parsedData.payload)
        );
      } catch (err) {
        return;
      }
    };
  };

  return ws;
};
