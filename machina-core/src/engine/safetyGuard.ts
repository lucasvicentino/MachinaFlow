export class SafetyGuard {
  private static emergencyStopActive: boolean = false;
  private static lastCommandTimestamps: Map<string, number> = new Map();
  private static readonly MIN_COMMAND_INTERVAL_MS = 50; // Prevent flooding PLC registers

  static triggerEmergencyStop(reason: string): void {
    this.emergencyStopActive = true;
    console.warn(`[SAFETY GUARD] PARADA DE EMERGÊNCIA ATIVADA: ${reason}`);
  }

  static resetEmergencyStop(): void {
    this.emergencyStopActive = false;
    console.info('[SAFETY GUARD] Parada de emergência rearmada.');
  }

  static isSafeToExecute(): boolean {
    return !this.emergencyStopActive;
  }

  static async assertRateLimit(machineKey: string): Promise<void> {
    const lastTime = this.lastCommandTimestamps.get(machineKey) || 0;
    const now = Date.now();
    const elapsed = now - lastTime;

    if (elapsed < this.MIN_COMMAND_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, this.MIN_COMMAND_INTERVAL_MS - elapsed));
    }

    this.lastCommandTimestamps.set(machineKey, Date.now());
  }
}

