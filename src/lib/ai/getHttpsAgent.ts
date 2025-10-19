import { Agent } from 'node:https';

let httpsAgent: Agent | undefined;

export function getHttpsAgent() {
  if (httpsAgent) {
    return httpsAgent;
  }
  httpsAgent = new Agent({
    rejectUnauthorized: false, // Disable certificate check
  });
  return httpsAgent;
}
