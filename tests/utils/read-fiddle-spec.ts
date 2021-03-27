import * as path from 'path';
import * as fs from 'fs-extra';
import { MAIN_JS_NAME } from '../../src/shared-constants';

import { readFiddle } from '../../src/utils/read-fiddle';

describe('read-fiddle', () => {
  beforeEach(async () => {
    (fs.existsSync as jest.Mock).mockImplementationOnce(() => true);
    (fs.readdirSync as jest.Mock).mockImplementationOnce(() => [
      'LICENSE.txt',
      MAIN_JS_NAME,
    ]);
  });

  it('reads known content', async () => {
    (fs.readFileSync as jest.Mock).mockImplementation((filename) =>
      path.basename(filename),
    );
    console.warn = jest.fn();
    const folder = '/some/place';

    const fiddle = await readFiddle(folder);

    expect(fiddle.css).toBe('');
    expect(fiddle.html).toBe('');
    expect(fiddle.main).toBe(MAIN_JS_NAME);
    expect(fiddle.preload).toBe('');
    expect(fiddle.renderer).toBe('');
    expect(console.warn).toHaveBeenCalledTimes(0);

    (console.warn as jest.Mock).mockClear();
  });

  it('handles read errors gracefully', async () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('bwap');
    });
    console.warn = jest.fn();
    const folder = '/some/place';

    const fiddle = await readFiddle(folder);

    expect(fiddle.css).toBe('');
    expect(fiddle.html).toBe('');
    expect(fiddle.main).toBe('');
    expect(fiddle.preload).toBe('');
    expect(fiddle.renderer).toBe('');
    expect(console.warn).toHaveBeenCalledTimes(1);

    (console.warn as jest.Mock).mockClear();
  });

  it('ensures truty even when read returns null', async () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => null);
    console.warn = jest.fn();
    const folder = '/some/place';

    const fiddle = await readFiddle(folder);

    expect(fiddle.css).toBe('');
    expect(fiddle.html).toBe('');
    expect(fiddle.main).toBe('');
    expect(fiddle.preload).toBe('');
    expect(fiddle.renderer).toBe('');
    expect(console.warn).toHaveBeenCalledTimes(0);

    (console.warn as jest.Mock).mockClear();
  });
});
