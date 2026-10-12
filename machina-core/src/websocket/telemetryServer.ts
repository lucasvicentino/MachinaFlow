import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { NodeStatusUpdate, MachineTelemetryReading } from '@machina/shared';

export class TelemetryServer {
  private static wss: WebSocketServer | null = null;
  private static clients: Set<WebSocket> = new Set();

  static initialize(server: Server): void {
    this.wss = new WebSocketServer({ server, path: '/ws/telemetry' });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('[WebSocket] Erro na conexão:', err);
      });
    });
  }

  static broadcastNodeStatus(update: NodeStatusUpdate): void {
    this.broadcast({
      type: 'flow:node_status',
      data: update
    });
  }

  static broadcastTelemetry(reading: MachineTelemetryReading): void {
    this.broadcast({
      type: 'telemetry:reading',
      data: reading
    });
  }

  private static broadcast(payload: Record<string, unknown>): void {
    const message = JSON.stringify(payload);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

