# Picture Mode Privacy & Data Isolation Architecture

## 1. Privacy-First Principles

In accordance with institutional requirements, FERPA considerations, and student data protection standards:

1. **Non-Persistence of Raw Images**: The application **does not permanently store photographs** of student work on server disk or in persistent databases. Once an image is processed into an AST, the raw bitmap is immediately released from memory.
2. **Deterministic On-Device Hash Fingerprinting**: Image caching relies strictly on deterministic SHA-256 fingerprint hashes (`img_<hash>_<length>_<bounds>`). No student photos or PII are retained in the cache.
3. **Data Minimization for AI Queries**: When a student asks a question via the Socratic AI Tutor regarding their photographed work, **only the parsed mathematical AST and plain text representation are sent to the LLM**. The raw photograph is never re-transmitted to AI providers.
4. **Institutional Local-Only Privacy Mode**: Administrators and teachers can activate `localOnlyPrivacyMode: true`, which unconditionally blocks any external cloud vision requests. Under this setting, 100% of recognition, preprocessing, and grading occurs exclusively in client memory.

---

## 2. Institutional Rate Limiting & Cost Safeguards

To prevent abuse and support 200+ concurrent students economically:
- **Daily Cloud Quota**: Defaults to 10 cloud requests per student per day (`dailyCloudLimitPerStudent`).
- **Circuit Breaker**: If 3 consecutive cloud requests fail or timeout (>6000ms), the system automatically trips open for 60 seconds and falls back to local processing.
- **Payload Guard**: `POST /api/picture/recognize` enforces a strict 4.0 MB base64 payload limit (HTTP 413 rejection for oversized inputs).
