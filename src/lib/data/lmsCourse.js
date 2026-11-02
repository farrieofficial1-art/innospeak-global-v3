import { ACADEMY_BY_CODE } from './academy.js';

export function resolveLmsCourse(raw) {
  if (!raw) return raw;
  const catalogue = raw.programme_code
    ? ACADEMY_BY_CODE[raw.programme_code]
    : ACADEMY_BY_CODE[raw.code];
  if (!catalogue) return raw;
  return {
    ...raw,
    title: raw.title || catalogue.title,
    level: raw.level || catalogue.level,
    category: raw.category || null,
    code: raw.code || raw.programme_code || catalogue.code,
  };
}
