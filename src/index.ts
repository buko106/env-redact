import { collectSecrets, redact } from "./redact.js";

let secrets: string[] | null = null;
const mask = process.env.ENV_REDACT_MASK ?? "***";

/** Re-scan the environment, e.g. after loading dotenv. */
export function refresh(): void {
  secrets = collectSecrets();
}

function patch(stream: NodeJS.WriteStream): void {
  const original = stream.write.bind(stream) as (...a: unknown[]) => boolean;
  stream.write = ((chunk: unknown, ...rest: unknown[]) => {
    secrets ??= collectSecrets();
    if (secrets.length && (typeof chunk === "string" || Buffer.isBuffer(chunk))) {
      chunk = redact(chunk.toString(), secrets, mask);
    }
    return original(chunk, ...rest);
  }) as typeof stream.write;
}

if (process.env.ENV_REDACT !== "off") {
  patch(process.stdout);
  patch(process.stderr);
}
