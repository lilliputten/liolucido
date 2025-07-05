import tinycolor from 'tinycolor2';

import { TColor } from '@/shared/types/generic/TColor';

/** Color spreading helper
 * Creates color spread table with folowing indices: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
 */
export function getColorSpread(id: string, color: string) {
  const darkCmp = tinycolor(color).darken(20);
  return {
    [id]: color, // The same as `{color}-500`
    // TODO: Pass foreground options via arguments?
    [`${id}-foreground`]: tinycolor.mostReadable(darkCmp, ['#fff', '#000']).toHexString(),
    [`${id}-50`]: tinycolor(color).darken(45).toHexString(),
    [`${id}-100`]: tinycolor(color).darken(40).toHexString(),
    [`${id}-200`]: tinycolor(color).darken(30).toHexString(),
    [`${id}-300`]: tinycolor(color).darken(20).toHexString(),
    [`${id}-400`]: tinycolor(color).darken(10).toHexString(),
    [`${id}-500`]: color,
    [`${id}-600`]: tinycolor(color).lighten(10).toHexString(),
    [`${id}-700`]: tinycolor(color).lighten(20).toHexString(),
    [`${id}-800`]: tinycolor(color).lighten(30).toHexString(),
    [`${id}-900`]: tinycolor(color).lighten(40).toHexString(),
    [`${id}-950`]: tinycolor(color).lighten(45).toHexString(),
  } as Record<string, TColor>;
}
