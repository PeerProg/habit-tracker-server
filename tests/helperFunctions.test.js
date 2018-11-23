import { isEmpty } from '../helpers';

const testString = '   ';
const sampleEmptyArray = [];
const sampleNonEmptyArray = ['value', 'target', 'name', 'field'];
const sampleNestedObject = {
  division: {
    house: {
      utilities: [],
      food: ''
    }
  }
};

describe('HELPER FUNCTIONS TEST SUITE', () => {
  describe('isEmpty', () => {
    it('indicates if a string is empty', () => {
      expect(isEmpty(testString)).toBe(true);
    });

    it('indicates if an array is empty', () => {
      expect(isEmpty(sampleEmptyArray)).toBe(true);
    });

    it('Returns false if the subblied param is not empty', () => {
      expect(isEmpty(sampleNonEmptyArray)).toBe(false);
    });

    it('Verifies the emptiness or otherwise of an object with nested properties', () => {
      expect(isEmpty(sampleNestedObject)).toBe(true);
    });
  });
});
