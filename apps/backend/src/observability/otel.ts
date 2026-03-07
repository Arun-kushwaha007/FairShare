import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

let sdk: NodeSDK | null = null;

export async function startOpenTelemetry(): Promise<void> {
  if (sdk) {
    return;
  }

  if ((process.env.OTEL_LOG_LEVEL ?? '').toLowerCase() === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdk.start();
}

export async function shutdownOpenTelemetry(): Promise<void> {
  if (!sdk) {
    return;
  }
  await sdk.shutdown();
  sdk = null;
}
