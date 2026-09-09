const SENSITIVE_KEY = /(KEY|SECRET|TOKEN|PASSWORD|PASSWD|PRIVATE|CREDENTIAL)/i;
const MIN_LENGTH = 8;

export function collectSecrets(env: NodeJS.ProcessEnv = process.env): string[] {
  return Object.entries(env)
    .filter(([k, v]) => SENSITIVE_KEY.test(k) && !!v && v.length >= MIN_LENGTH)
    .map(([, v]) => v as string)
    .sort((a, b) => b.length - a.length);
}

export function redact(text: string, secrets: readonly string[], mask = "***"): string {
  let out = text;
  for (const s of secrets) out = out.split(s).join(mask);
  return out;
}
