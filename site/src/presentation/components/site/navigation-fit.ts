/** Whether a row needs its full inline content measured after a size or content notification. */
export function shouldMeasureNavigation(
  wide: boolean,
  changed: boolean,
  width: number,
  previousWidth: number,
): boolean {
  return wide || changed || width > previousWidth;
}
