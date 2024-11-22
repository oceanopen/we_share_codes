import { SortTester } from '../../../utils/sort/SortTester';
import RadixSort from '../RadixSort';

// Complexity constants.
const ARRAY_OF_STRINGS_VISIT_COUNT = 32;
const ARRAY_OF_INTEGERS_VISIT_COUNT = 77;
describe('radixSort', () => {
    it('should sort array', () => {
        SortTester.testSort(RadixSort);
    });

    it('should sort array of strings', () => {
        const sorter = new RadixSort();
        expect(sorter.sort(['zzz', 'bb', 'ba', 'a', 'rr', 'rrd', 'rrb', 'rrba'])).toEqual([
            'a',
            'ba',
            'bb',
            'rr',
            'rrb',
            'rrba',
            'rrd',
            'zzz',
        ]);
    });

    it('should visit array of strings n (number of strings) x m (length of longest element) times', () => {
        SortTester.testAlgorithmTimeComplexity(
            RadixSort,
            ['zzz', 'ba', 'bb', 'a', 'rr', 'rrd', 'rrb', 'rrba'],
            ARRAY_OF_STRINGS_VISIT_COUNT,
        );
    });

    it('should visit array of integers n (number of elements) x m (length of longest integer) times', () => {
        SortTester.testAlgorithmTimeComplexity(
            RadixSort,
            [3, 1, 75, 32, 884, 523, 4343456, 232, 123, 656, 343],
            ARRAY_OF_INTEGERS_VISIT_COUNT,
        );
    });
});
