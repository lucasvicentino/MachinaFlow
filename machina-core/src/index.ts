import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from './config/env';
import apiRouter from './api/routes';
import { FlowRepository } from './database/repositories/flow.repository';
import { MachineRepository } from './database/repositories/machine.repository';
import { TelemetryServer } from './websocket/telemetryServer';

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Initialize Repositories and storage
FlowRepository.initialize();
MachineRepository.initialize();

// Initialize WebSocket Telemetry Server
TelemetryServer.initialize(server);

// API Routes
app.use('/api', apiRouter);

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MachineFlow Orchestrator', timestamp: new Date() });
});

// Start server
server.listen(config.port, () => {
  console.log(`[MachineFlow] Orquestrador rodando em http://localhost:${config.port}`);
  console.log(`[MachineFlow] WebSocket de telemetria ativo em ws://localhost:${config.port}/ws/telemetry`);
});

