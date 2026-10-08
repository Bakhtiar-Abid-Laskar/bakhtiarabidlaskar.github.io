/**
 * Build-time year generator function.
 * Section 9.8 / Phase 7 Task 4: Computed at build time from one function, not typed.
 */
export function getBuildYear(): number {
  return new Date().getFullYear();
}

export default getBuildYear;
