# env-redact

Import once. Secrets in env vars never reach stdout/stderr.

## Install

```bash
npm i env-redact
```

## Usage

Import it at the very top of your entry point, before anything that logs:

```js
import "env-redact";
```

CommonJS:

```js
require("env-redact");
```

That's it. From then on, anything written to `process.stdout` or `process.stderr` has the
secret values from your environment replaced with `***`:

```console
$ API_KEY=supersecret123 node app.js
key: ***
```

## Detection rule

An environment variable is treated as a secret when **both** hold:

- its name contains `KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `PASSWD`, `PRIVATE` or `CREDENTIAL`
  (case-insensitive), and
- its value is at least 8 characters long.

Longer values are replaced first, so a secret that contains another secret still masks cleanly.

## Options

| Option | Effect |
| --- | --- |
| `ENV_REDACT=off` | Disable redaction entirely. |
| `ENV_REDACT_MASK=<string>` | Use a different replacement string (default `***`). |
| `refresh()` | Re-scan the environment. |

The environment is scanned lazily on the first write, so loading `dotenv` after importing
`env-redact` still works. Call `refresh()` if variables change later:

```js
import { refresh } from "env-redact";

process.env.API_KEY = "a-new-value";
refresh();
```

## Limitations

- Replacement happens per `write` call on stdout/stderr. A secret split across two chunks is
  not detected.
- Node.js only. It patches `process.stdout` / `process.stderr` and does nothing in a browser.
- It is a safety net, not a guarantee — anything written through other channels (files,
  network, a logger with its own transport) is untouched.

## License

MIT
