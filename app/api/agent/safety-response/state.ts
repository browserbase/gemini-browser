const pendingSafetyResponses = new Map<string, (acknowledged: boolean) => void>();

export function createSafetyConfirmationPromise(
  sessionId: string,
  confirmationId: string
): Promise<boolean> {
  const key = `${sessionId}:${confirmationId}`;
  return new Promise((resolve) => {
    pendingSafetyResponses.set(key, resolve);
  });
}

export function resolveSafetyConfirmation(
  sessionId: string,
  confirmationId: string,
  acknowledged: boolean
): boolean {
  const key = `${sessionId}:${confirmationId}`;
  const resolve = pendingSafetyResponses.get(key);

  if (!resolve) {
    return false;
  }

  resolve(acknowledged);
  pendingSafetyResponses.delete(key);
  return true;
}
