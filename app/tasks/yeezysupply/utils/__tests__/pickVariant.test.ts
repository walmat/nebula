import { pickVariant } from '../pickVariant';
import { sizes } from '../../mocks/getAvailability';

const getLogger = () => ({
  // eslint-disable-next-line
  debug: console.log,
});

// keep always the same order
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  shuffle: (arr: any[]) => arr
}));

const { variation_list: variationList } = sizes;

it('should match size 7', async () => {
  const sizes = ['7'];

  const testVariants = [...variationList];

  const size = await pickVariant({
    variants: testVariants,
    sizes,
    logger: getLogger(),
    id: 'test'
  });

  expect(size.id).toBe('7');
});

it('should match size 7.5', async () => {
  const sizes = ['7.5'];

  const testVariants = [...variationList];

  const size = await pickVariant({
    variants: testVariants,
    sizes,
    logger: getLogger(),
    id: 'test'
  });

  expect(size.id).toBe('7.5');
});
