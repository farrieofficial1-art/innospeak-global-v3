// src/lib/data/catalogPolicy.js
//
// Catalogue field validation policy. Checks that every course record
// has the required grouping fields used by admissions, the portal and
// the career profile builder.

const REQUIRED_FIELDS = ['code', 'name', 'pathwayId'];

export function validateV3Fields(courses) {
  const incomplete = courses.filter((c) => REQUIRED_FIELDS.some((f) => !c[f]));
  return { complete: incomplete.length === 0, incomplete };
}
