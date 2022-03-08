import { pickSize } from '../pickVariant';
import { kithNewBalance, size10, size10dot5 } from '../mocks/kithNewBalance';

const getLogger = () => ({
  // eslint-disable-next-line
  debug: console.log,
});

// keep always the same order
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  shuffle: arr => arr
}));

const { variants } = kithNewBalance;
const [size7, size7dot5, size8] = variants;

it('should match size 7', async () => {
  const sizes = ['7'];

  const testVariants = [size7, size7dot5, size8];

  const size = await pickSize({
    variants: testVariants,
    sizes,
    logger: getLogger()
  });

  expect(size.id).toBe(size7.id);
});

it('should match size 7.5', async () => {
  const sizes = ['7.5'];

  const testVariants = [size7, size7dot5, size8];

  const size = await pickSize({
    variants: testVariants,
    sizes,
    logger: getLogger()
  });

  expect(size.id).toBe(size7dot5.id);
});

it('should match a random size', async () => {
  const sizes = ['7', '7.5', 'random'];

  const testVariants = [size8, size7dot5, size7];

  const size = await pickSize({
    variants: testVariants,
    sizes,
    logger: getLogger()
  });

  expect(size.id).toBe(size7dot5.id);
});

it('should not match 10.5 when doing random', async () => {
  const sizes = ['random', '10'];

  const testVariants = [size10dot5, size8, size7dot5, size7, size10];

  const size = await pickSize({
    variants: testVariants,
    sizes,
    logger: getLogger()
  });

  expect(size.id).toBe(size10.id);
});
