import { swap, swap2, swap3 } from '../swap';

const originArr = [5, 3, 4, 2];
const swapedArr = [5, 4, 3, 2];

describe('sort', () => {
    it('function swap', () => {
    // Clone original array to prevent its modification.
        const arr = [...originArr];
        swap(arr, 1, 2);
        expect(arr).toEqual(swapedArr);
    });
    it('function swap2', () => {
    // Clone original array to prevent its modification.
        const arr = [...originArr];
        swap2(arr, 1, 2);
        expect(arr).toEqual(swapedArr);
    });
    it('function swap3', () => {
    // Clone original array to prevent its modification.
        const arr = [...originArr];
        swap3(arr, 1, 2);
        expect(arr).toEqual(swapedArr);
    });
});
