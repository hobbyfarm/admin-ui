export function atou(b64Str: string) {
  if (!b64Str) {
    return b64Str;
  }

  const normalized = b64Str
    .replace(/\s/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Base64 can only have a remainder of 0, 2, or 3. Returning the original
  // value also supports legacy/already-decoded text, including emojis.
  if (
    normalized.length % 4 === 1 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)
  ) {
    return b64Str;
  }

  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );

  try {
    const text = atob(padded);
    const bytes = Uint8Array.from(text, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return b64Str;
  }
}

export function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}
