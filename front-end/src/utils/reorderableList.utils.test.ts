import { move } from "./reorderableList.utils";

describe('reorderableList.utils', () => {
    describe('move', () => {
        it('should move an element up', () => {
            const array = [1, 2, 3, 4, 5];
            const result = move(array, 'up', 2);
            expect(result).toEqual([1, 3, 2, 4, 5]);
        });

        it('should move an element down', () => {
            const array = [1, 2, 3, 4, 5];
            const result = move(array, 'down', 2);
            expect(result).toEqual([1, 2, 4, 3, 5]);
        });

        it('should not move the first element up', () => {
            const array = [1, 2, 3, 4, 5];
            const result = move(array, 'up', 0);
            expect(result).toEqual(array);
        });

        it('should not move the last element down', () => {
            const array = [1, 2, 3, 4, 5];
            const result = move(array, 'down', array.length - 1);
            expect(result).toEqual(array);
        });
    })
});