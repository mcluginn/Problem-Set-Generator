/**
 * AI Service Gateway Router
 */

import { IAIProvider } from './types';
import { GeminiProvider } from './gemini';
import { DeterministicFallbackProvider } from './fallback';

export * from './types';
export * from './fallback';
export * from './gemini';

let cachedKey: string | undefined = undefined;
let globalAIProvider: IAIProvider | null = null;

function loadKey(): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.GEMINI_API_KEY === '') return undefined;
    if (process.env.GEMINI_API_KEY) {
      const key = process.env.GEMINI_API_KEY.trim();
      if (key && !key.includes('YOUR_GEMINI_API_KEY_HERE')) return key;
    }
  }
  if (typeof process !== 'undefined' && typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const path = require('path');
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
        if (match && match[1]) {
          const val = match[1].trim();
          if (val && !val.includes('YOUR_GEMINI_API_KEY_HERE')) {
            process.env.GEMINI_API_KEY = val;
            return val;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return undefined;
}

export function getAIProvider(): IAIProvider {
  const currentKey = loadKey();
  if (currentKey && currentKey !== cachedKey) {
    cachedKey = currentKey;
    globalAIProvider = new GeminiProvider(currentKey);
    return globalAIProvider;
  }
  if (!currentKey && cachedKey) {
    cachedKey = undefined;
    globalAIProvider = new DeterministicFallbackProvider();
    return globalAIProvider;
  }
  if (!globalAIProvider) {
    if (currentKey) {
      cachedKey = currentKey;
      globalAIProvider = new GeminiProvider(currentKey);
    } else {
      globalAIProvider = new DeterministicFallbackProvider();
    }
  }
  return globalAIProvider;
}
