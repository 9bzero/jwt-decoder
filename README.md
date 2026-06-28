# jwt-decoder

Paste a JWT, see what's inside. Header, payload, and expiry at a glance — no server needed.

Decodes the header and payload locally (base64url decode + JSON parse). Does not verify the signature — this is a debugging tool, not a validator.

## Features

- Paste JWT → instant decode
- Shows expiry as human-readable time and countdown
- Highlights expired tokens
- Copy decoded JSON

## Run

```bash
npm install && npm run dev
```
