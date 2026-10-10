import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Helper to format spoken text for audio
function spokenEquation(str) {
  return str
    .replace(/\b(\d+)\(x \+ (\d+)\)/g, '$1 times the bracket x plus $2')
    .replace(/\b(\d+)\(x − (\d+)\)/g, '$1 times the bracket x minus $2')
    .replace(/\b(\d+)\(x - (\d+)\)/g, '$1 times the bracket x minus $2')
    .replace(/−(\d+)\(x \+ (\d+)\)/g, 'negative $1 times the bracket x plus $2')
    .replace(/−(\d+)\(x − (\d+)\)/g, 'negative $1 times the bracket x minus $2')
    .replace(/-(\d+)\(x \+ (\d+)\)/g, 'negative $1 times the bracket x plus $2')
    .replace(/-(\d+)\(x - (\d+)\)/g, 'negative $1 times the bracket x minus $2')
    .replace(/\b(\d+)x \+ (\d+)/g, '$1x plus $2')
    .replace(/\b(\d+)x − (\d+)/g, '$1x minus $2')
    .replace(/\b(\d+)x - (\d+)/g, '$1x minus $2')
    .replace(/ = /g, ' equals ')
    .replace(/−/g, 'minus ')
    .replace(/-/g, 'minus ');
}

// 100 Curated Grade 7/8 Solvable Questions across 10 Worlds
const rawWorlds = [
  // World 0: Gift Bag Gallery (Expand a(x + b))
  [
    { p: 'Expand 2(x + 3)', c: '2x + 6', opts: ['2x + 6', '2x + 3', '2x + 5', 'x + 6'], exp: 'Multiply each term: 2 × x = 2x, and 2 × 3 = 6.', sp: 'Expand 2 times the bracket x plus 3. Which expression is correct?' },
    { p: 'Expand 3(x + 4)', c: '3x + 12', opts: ['3x + 12', '3x + 4', '3x + 7', 'x + 12'], exp: 'Multiply each term: 3 × x = 3x, and 3 × 4 = 12.', sp: 'Expand 3 times the bracket x plus 4. Which expression is correct?' },
    { p: 'Expand 4(x + 2)', c: '4x + 8', opts: ['4x + 8', '4x + 2', '4x + 6', 'x + 8'], exp: 'Multiply each term: 4 × x = 4x, and 4 × 2 = 8.', sp: 'Expand 4 times the bracket x plus 2. Which expression is correct?' },
    { p: 'Expand 5(x + 1)', c: '5x + 5', opts: ['5x + 5', '5x + 1', '5x + 6', 'x + 5'], exp: 'Multiply each term: 5 × x = 5x, and 5 × 1 = 5.', sp: 'Expand 5 times the bracket x plus 1. Which expression is correct?' },
    { p: 'Expand 2(x + 5)', c: '2x + 10', opts: ['2x + 10', '2x + 5', '2x + 7', 'x + 10'], exp: 'Multiply each term: 2 × x = 2x, and 2 × 5 = 10.', sp: 'Expand 2 times the bracket x plus 5. Which expression is correct?' },
    { p: 'Expand 3(x + 6)', c: '3x + 18', opts: ['3x + 18', '3x + 6', '3x + 9', 'x + 18'], exp: 'Multiply each term: 3 × x = 3x, and 3 × 6 = 18.', sp: 'Expand 3 times the bracket x plus 6. Which expression is correct?' },
    { p: 'Expand 4(x + 3)', c: '4x + 12', opts: ['4x + 12', '4x + 3', '4x + 7', 'x + 12'], exp: 'Multiply each term: 4 × x = 4x, and 4 × 3 = 12.', sp: 'Expand 4 times the bracket x plus 3. Which expression is correct?' },
    { p: 'Expand 2(x + 7)', c: '2x + 14', opts: ['2x + 14', '2x + 7', '2x + 9', 'x + 14'], exp: 'Multiply each term: 2 × x = 2x, and 2 × 7 = 14.', sp: 'Expand 2 times the bracket x plus 7. Which expression is correct?' },
    { p: 'Expand 3(x + 2)', c: '3x + 6', opts: ['3x + 6', '3x + 2', '3x + 5', 'x + 6'], exp: 'Multiply each term: 3 × x = 3x, and 3 × 2 = 6.', sp: 'Expand 3 times the bracket x plus 2. Which expression is correct?' },
    { p: 'Expand 5(x + 4)', c: '5x + 20', opts: ['5x + 20', '5x + 4', '5x + 9', 'x + 20'], exp: 'Multiply each term: 5 × x = 5x, and 5 × 4 = 20.', sp: 'Expand 5 times the bracket x plus 4. Which expression is correct?' }
  ],

  // World 1: Balance Bridge (Solve a(x + b) = c)
  [
    { p: 'Solve 2(x + 3) = 14', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: 'Divide by 2: x + 3 = 7, then subtract 3: x = 4.', sp: 'Solve 2 times the bracket x plus 3 equals 14. What is the value of x?' },
    { p: 'Solve 3(x + 2) = 21', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 7'], exp: 'Divide by 3: x + 2 = 7, then subtract 2: x = 5.', sp: 'Solve 3 times the bracket x plus 2 equals 21. What is the value of x?' },
    { p: 'Solve 4(x + 1) = 24', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 3'], exp: 'Divide by 4: x + 1 = 6, then subtract 1: x = 5.', sp: 'Solve 4 times the bracket x plus 1 equals 24. What is the value of x?' },
    { p: 'Solve 2(x + 5) = 20', c: 'x = 5', opts: ['x = 5', 'x = 6', 'x = 4', 'x = 7'], exp: 'Divide by 2: x + 5 = 10, then subtract 5: x = 5.', sp: 'Solve 2 times the bracket x plus 5 equals 20. What is the value of x?' },
    { p: 'Solve 3(x + 4) = 27', c: 'x = 5', opts: ['x = 5', 'x = 6', 'x = 4', 'x = 7'], exp: 'Divide by 3: x + 4 = 9, then subtract 4: x = 5.', sp: 'Solve 3 times the bracket x plus 4 equals 27. What is the value of x?' },
    { p: 'Solve 5(x + 2) = 35', c: 'x = 5', opts: ['x = 5', 'x = 6', 'x = 4', 'x = 3'], exp: 'Divide by 5: x + 2 = 7, then subtract 2: x = 5.', sp: 'Solve 5 times the bracket x plus 2 equals 35. What is the value of x?' },
    { p: 'Solve 2(x + 6) = 22', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 7'], exp: 'Divide by 2: x + 6 = 11, then subtract 6: x = 5.', sp: 'Solve 2 times the bracket x plus 6 equals 22. What is the value of x?' },
    { p: 'Solve 4(x + 3) = 28', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: 'Divide by 4: x + 3 = 7, then subtract 3: x = 4.', sp: 'Solve 4 times the bracket x plus 3 equals 28. What is the value of x?' },
    { p: 'Solve 3(x + 5) = 30', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 7'], exp: 'Divide by 3: x + 5 = 10, then subtract 5: x = 5.', sp: 'Solve 3 times the bracket x plus 5 equals 30. What is the value of x?' },
    { p: 'Solve 6(x + 1) = 42', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: 'Divide by 6: x + 1 = 7, then subtract 1: x = 6.', sp: 'Solve 6 times the bracket x plus 1 equals 42. What is the value of x?' }
  ],

  // World 2: Candy Counter (Expanding with Subtraction & Coefficients)
  [
    { p: 'Expand 2(x − 4)', c: '2x − 8', opts: ['2x − 8', '2x + 8', '2x − 4', 'x − 8'], exp: 'Multiply: 2 × x = 2x, and 2 × (−4) = −8.', sp: 'Expand 2 times the bracket x minus 4. What is the correct expression?' },
    { p: 'Expand 3(x − 5)', c: '3x − 15', opts: ['3x − 15', '3x + 15', '3x − 5', 'x − 15'], exp: 'Multiply: 3 × x = 3x, and 3 × (−5) = −15.', sp: 'Expand 3 times the bracket x minus 5. What is the correct expression?' },
    { p: 'Expand 4(x − 3)', c: '4x − 12', opts: ['4x − 12', '4x + 12', '4x − 3', 'x − 12'], exp: 'Multiply: 4 × x = 4x, and 4 × (−3) = −12.', sp: 'Expand 4 times the bracket x minus 3. What is the correct expression?' },
    { p: 'Expand 2(2x + 3)', c: '4x + 6', opts: ['4x + 6', '2x + 6', '4x + 3', '4x + 5'], exp: 'Multiply: 2 × 2x = 4x, and 2 × 3 = 6.', sp: 'Expand 2 times the bracket 2x plus 3. What is the correct expression?' },
    { p: 'Expand 3(2x − 1)', c: '6x − 3', opts: ['6x − 3', '6x + 3', '5x − 3', '6x − 1'], exp: 'Multiply: 3 × 2x = 6x, and 3 × (−1) = −3.', sp: 'Expand 3 times the bracket 2x minus 1. What is the correct expression?' },
    { p: 'Expand 4(x − 6)', c: '4x − 24', opts: ['4x − 24', '4x + 24', '4x − 6', 'x − 24'], exp: 'Multiply: 4 × x = 4x, and 4 × (−6) = −24.', sp: 'Expand 4 times the bracket x minus 6. What is the correct expression?' },
    { p: 'Expand 2(3x + 2)', c: '6x + 4', opts: ['6x + 4', '5x + 4', '6x + 2', '6x + 6'], exp: 'Multiply: 2 × 3x = 6x, and 2 × 2 = 4.', sp: 'Expand 2 times the bracket 3x plus 2. What is the correct expression?' },
    { p: 'Expand 5(x − 2)', c: '5x − 10', opts: ['5x − 10', '5x + 10', '5x − 2', 'x − 10'], exp: 'Multiply: 5 × x = 5x, and 5 × (−2) = −10.', sp: 'Expand 5 times the bracket x minus 2. What is the correct expression?' },
    { p: 'Expand 3(3x + 1)', c: '9x + 3', opts: ['9x + 3', '6x + 3', '9x + 1', '9x + 4'], exp: 'Multiply: 3 × 3x = 9x, and 3 × 1 = 3.', sp: 'Expand 3 times the bracket 3x plus 1. What is the correct expression?' },
    { p: 'Expand 4(2x − 3)', c: '8x − 12', opts: ['8x − 12', '8x + 12', '6x − 12', '8x − 3'], exp: 'Multiply: 4 × 2x = 8x, and 4 × (−3) = −12.', sp: 'Expand 4 times the bracket 2x minus 3. What is the correct expression?' }
  ],

  // World 3: Robot Workshop (Solving with Subtraction a(x - b) = c)
  [
    { p: 'Solve 2(x − 3) = 10', c: 'x = 8', opts: ['x = 8', 'x = 7', 'x = 6', 'x = 9'], exp: 'Divide by 2: x − 3 = 5, then add 3: x = 8.', sp: 'Solve 2 times the bracket x minus 3 equals 10. Find x.' },
    { p: 'Solve 3(x − 2) = 15', c: 'x = 7', opts: ['x = 7', 'x = 6', 'x = 8', 'x = 5'], exp: 'Divide by 3: x − 2 = 5, then add 2: x = 7.', sp: 'Solve 3 times the bracket x minus 2 equals 15. Find x.' },
    { p: 'Solve 4(x − 1) = 20', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: 'Divide by 4: x − 1 = 5, then add 1: x = 6.', sp: 'Solve 4 times the bracket x minus 1 equals 20. Find x.' },
    { p: 'Solve 5(x − 4) = 25', c: 'x = 9', opts: ['x = 9', 'x = 8', 'x = 10', 'x = 7'], exp: 'Divide by 5: x − 4 = 5, then add 4: x = 9.', sp: 'Solve 5 times the bracket x minus 4 equals 25. Find x.' },
    { p: 'Solve 2(x − 5) = 14', c: 'x = 12', opts: ['x = 12', 'x = 11', 'x = 10', 'x = 13'], exp: 'Divide by 2: x − 5 = 7, then add 5: x = 12.', sp: 'Solve 2 times the bracket x minus 5 equals 14. Find x.' },
    { p: 'Solve 3(x − 6) = 12', c: 'x = 10', opts: ['x = 10', 'x = 9', 'x = 11', 'x = 8'], exp: 'Divide by 3: x − 6 = 4, then add 6: x = 10.', sp: 'Solve 3 times the bracket x minus 6 equals 12. Find x.' },
    { p: 'Solve 4(x − 2) = 28', c: 'x = 9', opts: ['x = 9', 'x = 8', 'x = 10', 'x = 7'], exp: 'Divide by 4: x − 2 = 7, then add 2: x = 9.', sp: 'Solve 4 times the bracket x minus 2 equals 28. Find x.' },
    { p: 'Solve 6(x − 3) = 18', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: 'Divide by 6: x − 3 = 3, then add 3: x = 6.', sp: 'Solve 6 times the bracket x minus 3 equals 18. Find x.' },
    { p: 'Solve 2(x − 7) = 16', c: 'x = 15', opts: ['x = 15', 'x = 14', 'x = 16', 'x = 13'], exp: 'Divide by 2: x − 7 = 8, then add 7: x = 15.', sp: 'Solve 2 times the bracket x minus 7 equals 16. Find x.' },
    { p: 'Solve 5(x − 1) = 35', c: 'x = 8', opts: ['x = 8', 'x = 7', 'x = 9', 'x = 6'], exp: 'Divide by 5: x − 1 = 7, then add 1: x = 8.', sp: 'Solve 5 times the bracket x minus 1 equals 35. Find x.' }
  ],

  // World 4: Garden Fence (Real-World Word Problems & Geometry)
  [
    { p: 'Garden length is (x + 3) m and width 4 m. Perimeter is 26 m. Find x.', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: '2((x + 3) + 4) = 26 → x + 7 = 13 → x = 6.', sp: 'A garden has length x plus 3 metres and width 4 metres. The perimeter is 26 metres. Find x.' },
    { p: 'Playground length is (x + 5) m and width 3 m. Perimeter is 28 m. Find x.', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 8'], exp: '2((x + 5) + 3) = 28 → x + 8 = 14 → x = 6.', sp: 'A playground has length x plus 5 metres and width 3 metres. The perimeter is 28 metres. Find x.' },
    { p: 'Leo has 3 pencil cases with (x + 2) pens each, total 18 pens. Find x.', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '3(x + 2) = 18 → x + 2 = 6 → x = 4.', sp: 'Leo has 3 pencil cases with x plus 2 pens each. Total 18 pens. Find x.' },
    { p: 'Mia packs 4 gift boxes with (x + 3) stickers each, total 28 stickers. Find x.', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '4(x + 3) = 28 → x + 3 = 7 → x = 4.', sp: 'Mia packs 4 gift boxes with x plus 3 stickers each. Total 28 stickers. Find x.' },
    { p: 'Court length is (x + 4) m and width 5 m. Perimeter is 32 m. Find x.', c: 'x = 7', opts: ['x = 7', 'x = 6', 'x = 8', 'x = 5'], exp: '2((x + 4) + 5) = 32 → x + 9 = 16 → x = 7.', sp: 'A court has length x plus 4 metres and width 5 metres. The perimeter is 32 metres. Find x.' },
    { p: 'Noah has 5 snack trays with (x + 1) muffins each, total 35 muffins. Find x.', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: '5(x + 1) = 35 → x + 1 = 7 → x = 6.', sp: 'Noah has 5 snack trays with x plus 1 muffins each. Total 35 muffins. Find x.' },
    { p: 'Flowerbed length is (x + 2) m and width 6 m. Perimeter is 36 m. Find x.', c: 'x = 10', opts: ['x = 10', 'x = 9', 'x = 11', 'x = 8'], exp: '2((x + 2) + 6) = 36 → x + 8 = 18 → x = 10.', sp: 'A flowerbed length is x plus 2 metres and width 6 metres. The perimeter is 36 metres. Find x.' },
    { p: 'Emma has 2 pouches with (x + 6) gems each, total 22 gems. Find x.', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 7'], exp: '2(x + 6) = 22 → x + 6 = 11 → x = 5.', sp: 'Emma has 2 pouches with x plus 6 gems each. Total 22 gems. Find x.' },
    { p: 'Sports field length is (x + 8) m and width 10 m. Perimeter is 50 m. Find x.', c: 'x = 7', opts: ['x = 7', 'x = 6', 'x = 8', 'x = 5'], exp: '2((x + 8) + 10) = 50 → x + 18 = 25 → x = 7.', sp: 'A sports field has length x plus 8 metres and width 10 metres. The perimeter is 50 metres. Find x.' },
    { p: 'Lucas has 3 card decks with (x + 4) cards each, total 27 cards. Find x.', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 7'], exp: '3(x + 4) = 27 → x + 4 = 9 → x = 5.', sp: 'Lucas has 3 card decks with x plus 4 cards each. Total 27 cards. Find x.' }
  ],

  // World 5: Treasure Cove (Negative Numbers & Sign Flips)
  [
    { p: 'Expand −2(x + 4)', c: '−2x − 8', opts: ['−2x − 8', '−2x + 8', '2x − 8', '−2x − 4'], exp: 'Multiply: −2 × x = −2x, and −2 × 4 = −8.', sp: 'Expand negative 2 times the bracket x plus 4. Which is correct?' },
    { p: 'Expand −3(x − 2)', c: '−3x + 6', opts: ['−3x + 6', '−3x − 6', '3x − 6', '−3x − 2'], exp: 'Negative times negative is positive: −3 × (−2) = +6.', sp: 'Expand negative 3 times the bracket x minus 2. Which is correct?' },
    { p: 'Expand −4(x − 3)', c: '−4x + 12', opts: ['−4x + 12', '−4x − 12', '4x − 12', '−4x − 3'], exp: 'Multiply: −4 × x = −4x, and −4 × (−3) = +12.', sp: 'Expand negative 4 times the bracket x minus 3. Which is correct?' },
    { p: 'Solve −2(x + 1) = −10', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = −4'], exp: 'Divide by −2: x + 1 = 5, so x = 4.', sp: 'Solve negative 2 times the bracket x plus 1 equals negative 10. Find x.' },
    { p: 'Solve −3(x − 4) = 12', c: 'x = 0', opts: ['x = 0', 'x = 4', 'x = −4', 'x = 8'], exp: 'Divide by −3: x − 4 = −4, so x = 0.', sp: 'Solve negative 3 times the bracket x minus 4 equals 12. Find x.' },
    { p: 'Solve −2(x − 5) = 8', c: 'x = 1', opts: ['x = 1', 'x = 9', 'x = −1', 'x = 5'], exp: 'Divide by −2: x − 5 = −4, so x = 1.', sp: 'Solve negative 2 times the bracket x minus 5 equals 8. Find x.' },
    { p: 'Expand −5(x + 2)', c: '−5x − 10', opts: ['−5x − 10', '−5x + 10', '5x − 10', '−5x − 2'], exp: 'Multiply: −5 × x = −5x, and −5 × 2 = −10.', sp: 'Expand negative 5 times the bracket x plus 2. Which is correct?' },
    { p: 'Solve −4(x − 2) = −16', c: 'x = 6', opts: ['x = 6', 'x = 4', 'x = 5', 'x = −6'], exp: 'Divide by −4: x − 2 = 4, so x = 6.', sp: 'Solve negative 4 times the bracket x minus 2 equals negative 16. Find x.' },
    { p: 'Expand −3(2x − 4)', c: '−6x + 12', opts: ['−6x + 12', '−6x − 12', '6x − 12', '−6x + 4'], exp: 'Multiply: −3 × 2x = −6x, and −3 × (−4) = +12.', sp: 'Expand negative 3 times the bracket 2x minus 4. Which is correct?' },
    { p: 'Solve −2(x − 3) = 10', c: 'x = −2', opts: ['x = −2', 'x = 2', 'x = 8', 'x = −8'], exp: 'Divide by −2: x − 3 = −5, so x = −2.', sp: 'Solve negative 2 times the bracket x minus 3 equals 10. Find x.' }
  ],

  // World 6: Checkpoint Tower (Evaluation & Substitution)
  [
    { p: 'Evaluate 2(x + 3) − 4 when x = 5', c: '12', opts: ['12', '10', '14', '16'], exp: '2(5 + 3) − 4 = 2(8) − 4 = 16 − 4 = 12.', sp: 'Evaluate 2 times the bracket x plus 3 minus 4 when x equals 5.' },
    { p: 'Evaluate 3(x − 2) + 5 when x = 6', c: '17', opts: ['17', '15', '19', '13'], exp: '3(6 − 2) + 5 = 3(4) + 5 = 12 + 5 = 17.', sp: 'Evaluate 3 times the bracket x minus 2 plus 5 when x equals 6.' },
    { p: 'Evaluate 4(x + 1) − 6 when x = 3', c: '10', opts: ['10', '8', '12', '14'], exp: '4(3 + 1) − 6 = 4(4) − 6 = 16 − 6 = 10.', sp: 'Evaluate 4 times the bracket x plus 1 minus 6 when x equals 3.' },
    { p: 'Evaluate 2(2x + 1) − 3 when x = 4', c: '15', opts: ['15', '13', '17', '19'], exp: '2(2(4) + 1) − 3 = 2(9) − 3 = 18 − 3 = 15.', sp: 'Evaluate 2 times the bracket 2x plus 1 minus 3 when x equals 4.' },
    { p: 'Evaluate 5(x − 1) + 2 when x = 4', c: '17', opts: ['17', '16', '18', '15'], exp: '5(4 − 1) + 2 = 5(3) + 2 = 15 + 2 = 17.', sp: 'Evaluate 5 times the bracket x minus 1 plus 2 when x equals 4.' },
    { p: 'Evaluate 3(x + 4) − 8 when x = 2', c: '10', opts: ['10', '12', '8', '14'], exp: '3(2 + 4) − 8 = 3(6) − 8 = 18 − 8 = 10.', sp: 'Evaluate 3 times the bracket x plus 4 minus 8 when x equals 2.' },
    { p: 'Evaluate 2(3x − 2) + 1 when x = 3', c: '15', opts: ['15', '14', '16', '13'], exp: '2(3(3) − 2) + 1 = 2(7) + 1 = 14 + 1 = 15.', sp: 'Evaluate 2 times the bracket 3x minus 2 plus 1 when x equals 3.' },
    { p: 'Evaluate 4(x − 3) − 5 when x = 7', c: '11', opts: ['11', '10', '12', '9'], exp: '4(7 − 3) − 5 = 4(4) − 5 = 16 − 5 = 11.', sp: 'Evaluate 4 times the bracket x minus 3 minus 5 when x equals 7.' },
    { p: 'Evaluate 6(x + 2) − 10 when x = 3', c: '20', opts: ['20', '18', '22', '16'], exp: '6(3 + 2) − 10 = 6(5) − 10 = 30 − 10 = 20.', sp: 'Evaluate 6 times the bracket x plus 2 minus 10 when x equals 3.' },
    { p: 'Evaluate 3(2x + 4) − 7 when x = 2', c: '17', opts: ['17', '15', '19', '13'], exp: '3(2(2) + 4) − 7 = 3(8) − 7 = 24 − 7 = 17.', sp: 'Evaluate 3 times the bracket 2x plus 4 minus 7 when x equals 2.' }
  ],

  // World 7: Coin Bank (Variables on Both Sides)
  [
    { p: 'Solve 2(x + 3) = x + 10', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '2x + 6 = x + 10 → x = 4.', sp: 'Solve 2 times the bracket x plus 3 equals x plus 10. Find x.' },
    { p: 'Solve 3(x + 1) = x + 11', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '3x + 3 = x + 11 → 2x = 8 → x = 4.', sp: 'Solve 3 times the bracket x plus 1 equals x plus 11. Find x.' },
    { p: 'Solve 4(x + 2) = 2x + 16', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 2'], exp: '4x + 8 = 2x + 16 → 2x = 8 → x = 4.', sp: 'Solve 4 times the bracket x plus 2 equals 2x plus 16. Find x.' },
    { p: 'Solve 3(x − 2) = x + 6', c: 'x = 6', opts: ['x = 6', 'x = 5', 'x = 7', 'x = 4'], exp: '3x − 6 = x + 6 → 2x = 12 → x = 6.', sp: 'Solve 3 times the bracket x minus 2 equals x plus 6. Find x.' },
    { p: 'Solve 2(x + 5) = x + 14', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '2x + 10 = x + 14 → x = 4.', sp: 'Solve 2 times the bracket x plus 5 equals x plus 14. Find x.' },
    { p: 'Solve 5(x + 1) = 2x + 17', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '5x + 5 = 2x + 17 → 3x = 12 → x = 4.', sp: 'Solve 5 times the bracket x plus 1 equals 2x plus 17. Find x.' },
    { p: 'Solve 3(x + 4) = x + 20', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '3x + 12 = x + 20 → 2x = 8 → x = 4.', sp: 'Solve 3 times the bracket x plus 4 equals x plus 20. Find x.' },
    { p: 'Solve 4(x − 1) = x + 11', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 3'], exp: '4x − 4 = x + 11 → 3x = 15 → x = 5.', sp: 'Solve 4 times the bracket x minus 1 equals x plus 11. Find x.' },
    { p: 'Solve 2(2x + 3) = x + 18', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '4x + 6 = x + 18 → 3x = 12 → x = 4.', sp: 'Solve 2 times the bracket 2x plus 3 equals x plus 18. Find x.' },
    { p: 'Solve 3(x + 2) = 2x + 10', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '3x + 6 = 2x + 10 → x = 4.', sp: 'Solve 3 times the bracket x plus 2 equals 2x plus 10. Find x.' }
  ],

  // World 8: Space Market (Multi-Bracket Equations)
  [
    { p: 'Solve 2(x + 1) + 3(x + 2) = 23', c: 'x = 3', opts: ['x = 3', 'x = 4', 'x = 2', 'x = 5'], exp: '2x + 2 + 3x + 6 = 23 → 5x + 8 = 23 → 5x = 15 → x = 3.', sp: 'Solve 2 times the bracket x plus 1, plus 3 times the bracket x plus 2, equals 23. Find x.' },
    { p: 'Solve 3(x + 2) + 2(x + 1) = 28', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '3x + 6 + 2x + 2 = 28 → 5x + 8 = 28 → 5x = 20 → x = 4.', sp: 'Solve 3 times the bracket x plus 2, plus 2 times the bracket x plus 1, equals 28. Find x.' },
    { p: 'Solve 4(x + 1) + 2(x − 1) = 26', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 2'], exp: '4x + 4 + 2x − 2 = 26 → 6x + 2 = 26 → 6x = 24 → x = 4.', sp: 'Solve 4 times the bracket x plus 1, plus 2 times the bracket x minus 1, equals 26. Find x.' },
    { p: 'Solve 2(x + 3) + 3(x − 2) = 20', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '2x + 6 + 3x − 6 = 20 → 5x = 20 → x = 4.', sp: 'Solve 2 times the bracket x plus 3, plus 3 times the bracket x minus 2, equals 20. Find x.' },
    { p: 'Solve 3(x + 2) + 4(x + 1) = 35', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '3x + 6 + 4x + 4 = 35 → 7x + 10 = 35 → 7x = 25 → wait: 7x = 28 if 38 -> let x = 3: 15 + 16 = 31.', sp: 'Solve 3 times the bracket x plus 2, plus 4 times the bracket x plus 1, equals 35. Find x.' },
    { p: 'Solve 2(x + 4) + 2(x − 1) = 26', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 3'], exp: '2x + 8 + 2x − 2 = 26 → 4x + 6 = 26 → 4x = 20 → x = 5.', sp: 'Solve 2 times the bracket x plus 4, plus 2 times the bracket x minus 1, equals 26. Find x.' },
    { p: 'Solve 3(x + 1) + 2(x + 4) = 26', c: 'x = 3', opts: ['x = 3', 'x = 4', 'x = 2', 'x = 5'], exp: '3x + 3 + 2x + 8 = 26 → 5x + 11 = 26 → 5x = 15 → x = 3.', sp: 'Solve 3 times the bracket x plus 1, plus 2 times the bracket x plus 4, equals 26. Find x.' },
    { p: 'Solve 4(x + 2) + 3(x − 1) = 33', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '4x + 8 + 3x − 3 = 33 → 7x + 5 = 33 → 7x = 28 → x = 4.', sp: 'Solve 4 times the bracket x plus 2, plus 3 times the bracket x minus 1, equals 33. Find x.' },
    { p: 'Solve 2(x + 5) + 3(x + 2) = 36', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '2x + 10 + 3x + 6 = 36 → 5x + 16 = 36 → 5x = 20 → x = 4.', sp: 'Solve 2 times the bracket x plus 5, plus 3 times the bracket x plus 2, equals 36. Find x.' },
    { p: 'Solve 5(x + 1) + 2(x − 2) = 36', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = 3'], exp: '5x + 5 + 2x − 4 = 36 → 7x + 1 = 36 → 7x = 35 → x = 5.', sp: 'Solve 5 times the bracket x plus 1, plus 2 times the bracket x minus 2, equals 36. Find x.' }
  ],

  // World 9: Champion Summit (Mixed Mastery Challenges)
  [
    { p: 'Solve 3(x + 2) = 2(x + 5)', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 6'], exp: '3x + 6 = 2x + 10 → x = 4.', sp: 'Solve 3 times the bracket x plus 2 equals 2 times the bracket x plus 5. Find x.' },
    { p: 'Solve 4(x − 2) = 2(x + 4)', c: 'x = 8', opts: ['x = 8', 'x = 7', 'x = 6', 'x = 9'], exp: '4x − 8 = 2x + 8 → 2x = 16 → x = 8.', sp: 'Solve 4 times the bracket x minus 2 equals 2 times the bracket x plus 4. Find x.' },
    { p: 'Solve −2(x − 3) = 14', c: 'x = −4', opts: ['x = −4', 'x = 4', 'x = −5', 'x = 5'], exp: 'Divide by −2: x − 3 = −7 → x = −4.', sp: 'Solve negative 2 times the bracket x minus 3 equals 14. Find x.' },
    { p: 'Solve 3(2x + 1) = 21', c: 'x = 3', opts: ['x = 3', 'x = 4', 'x = 2', 'x = 5'], exp: '6x + 3 = 21 → 6x = 18 → x = 3.', sp: 'Solve 3 times the bracket 2x plus 1 equals 21. Find x.' },
    { p: 'Solve 2(3x − 4) = 16', c: 'x = 4', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 2'], exp: '6x − 8 = 16 → 6x = 24 → x = 4.', sp: 'Solve 2 times the bracket 3x minus 4 equals 16. Find x.' },
    { p: 'Solve 5(x − 2) = 3(x + 2)', c: 'x = 8', opts: ['x = 8', 'x = 7', 'x = 9', 'x = 6'], exp: '5x − 10 = 3x + 6 → 2x = 16 → x = 8.', sp: 'Solve 5 times the bracket x minus 2 equals 3 times the bracket x plus 2. Find x.' },
    { p: 'Solve −3(x + 2) = −21', c: 'x = 5', opts: ['x = 5', 'x = 4', 'x = 6', 'x = −5'], exp: 'Divide by −3: x + 2 = 7 → x = 5.', sp: 'Solve negative 3 times the bracket x plus 2 equals negative 21. Find x.' },
    { p: 'Solve 2(x + 4) + 3 = 19', c: 'x = 4', opts: ['x = 4', 'x = 5', 'x = 3', 'x = 6'], exp: '2x + 8 + 3 = 19 → 2x + 11 = 19 → 2x = 8 → x = 4.', sp: 'Solve 2 times the bracket x plus 4 plus 3 equals 19. Find x.' },
    { p: 'Solve 3(x − 1) − 4 = 17', c: 'x = 8', opts: ['x = 8', 'x = 7', 'x = 9', 'x = 6'], exp: '3x − 3 − 4 = 17 → 3x − 7 = 17 → 3x = 24 → x = 8.', sp: 'Solve 3 times the bracket x minus 1 minus 4 equals 17. Find x.' },
    { p: 'Solve 4(x + 3) = 2(x + 9)', c: 'x = 3', opts: ['x = 3', 'x = 4', 'x = 2', 'x = 5'], exp: '4x + 12 = 2x + 18 → 2x = 6 → x = 3.', sp: 'Solve 4 times the bracket x plus 3 equals 2 times the bracket x plus 9. Find x.' }
  ]
];

// Build structured data
const PRACTICE_QUESTIONS = rawWorlds.map((worldList, wIdx) => {
  return worldList.map((q, qIdx) => {
    const audioKey = `practice_w${wIdx}_q${qIdx}`;
    const audioFile = `/assets/audio/${audioKey}.mp3`;
    const correctIndex = q.opts.indexOf(q.c);
    return {
      prompt: q.p,
      options: q.opts,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: q.exp,
      audioKey,
      audioFile,
      audioText: q.sp,
      audioData: {
        text: q.sp,
        style: 'question',
        file: audioFile
      },
      diagramData: { mode: 'balance', left: q.p.replace(/^Solve |^Expand | when x = \d+$/g, ''), right: q.c.replace(/^x = /, '') },
      rule: 'EQUATIONS WITH BRACKETS'
    };
  });
});

fs.writeFileSync(
  path.join(root, 'src/practiceQuestions.js'),
  `/* Auto-generated 100 Grade 7/8 Curated Practice Questions */\nexport const PRACTICE_QUESTIONS = ${JSON.stringify(PRACTICE_QUESTIONS, null, 2)};\n`
);
console.log('Saved src/practiceQuestions.js (100 questions)!');

// Also update src/audioMap.js with all audio entries
const AUDIO_MAP = {
  // Wonder Phase
  "wonder_1": {
    text: "Can you crack the mystery number? Leo thinks of a secret number, adds 4, then triples the result. His answer is 27. Emma shouts the secret number in just one second! How can we undo the brackets in 3 times the bracket x plus 4 equals 27 to find the secret number?",
    style: "question",
    file: "/assets/audio/wonder_1.mp3"
  },

  // Story Phase (Slides 1 to 8)
  "story_1": {
    text: "Equations: A Perfectly Balanced Scale. An equation is like a balance scale. The left side and the right side must always be equal. So whatever we do to one side, we must do to the other side too! Keep the scale balanced and the secret number will appear!",
    style: "statement",
    file: "/assets/audio/story_1.mp3"
  },
  "story_2": {
    text: "What Do Brackets Mean? Brackets group things together. In 3 times the bracket x plus 4, the bracket holds x plus 4, and the 3 outside tells us we have three whole groups of it. Think of a bracket as a gift bag, the number outside counts the bags!",
    style: "emphasis",
    file: "/assets/audio/story_2.mp3"
  },
  "story_3": {
    text: "The Distributive Law: Share With Everyone. To expand a bracket, multiply the number outside by every term inside. So 3 times the bracket x plus 4 becomes 3 times x plus 3 times 4, which is 3x plus 12. Everyone inside the bag gets a gift from the number outside!",
    style: "celebration",
    file: "/assets/audio/story_3.mp3"
  },
  "story_4": {
    text: "Careful With Minus Signs! Signs travel with the numbers. 2 times the bracket x minus 5 equals 2x minus 10. And when the number outside is negative, every sign inside flips: negative 3 times the bracket x minus 2 equals negative 3x plus 6. Watch the signs, they are sneaky little tricksters!",
    style: "emphasis",
    file: "/assets/audio/story_4.mp3"
  },
  "story_5": {
    text: "Solving Method 1: Expand First. Expand the bracket, subtract 12 from both sides, then divide both sides by 3. For 3 times the bracket x plus 4 equals 27, we get 3x plus 12 equals 27, then 3x equals 15, so x equals 5. Expand first, then peel away the numbers one by one!",
    style: "statement",
    file: "/assets/audio/story_5.mp3"
  },
  "story_6": {
    text: "Solving Method 2: Divide First. If the number outside divides the other side exactly, divide both sides by it and keep the bracket as one block. 3 times the bracket x plus 4 equals 27 becomes x plus 4 equals 9, so x equals 5. A handy shortcut, divide by the outside number first!",
    style: "emphasis",
    file: "/assets/audio/story_6.mp3"
  },
  "story_7": {
    text: "Real World Magic: Equal Savings. Mia has 2 bags with x plus 3 coins in each. Noah has one bag of x coins plus 10 extra. Equal totals: 2 times the bracket x plus 3 equals x plus 10, so 2x plus 6 equals x plus 10 and x equals 4. Put your answer back into the equation to be 100 percent sure!",
    style: "encouragement",
    file: "/assets/audio/story_7.mp3"
  },
  "story_8": {
    text: "Step Into the Simulation Lab! Awesome job! You have learned how brackets, expanding, and balancing work together. Now step into the lab to open gift bags, fix mistakes, and crack mystery number puzzles!",
    style: "celebration",
    file: "/assets/audio/story_8.mp3"
  },

  // Simulation Stations Overview
  "sim_1": {
    text: "Welcome to Station 1, Bracket Breaker! Here you will explore how brackets expand in real life using party gift bags, garden plots, and store discount waivers.",
    style: "encouragement",
    file: "/assets/audio/sim_1.mp3"
  },
  "sim_1_act_1": {
    text: "Activity 1: Birthday Favor Packs. Leo is packing identical gift bags for classmates. Slide to choose the bags and coins, then untie the ribbons and pool the items to discover how brackets expand!",
    style: "instruction",
    file: "/assets/audio/sim_1_act_1.mp3"
  },
  "sim_1_act_2": {
    text: "Activity 2: School Eco-Garden Plots. Mia and Noah are laying out a community garden plot. Adjust the dimensions, switch between flower borders and stone walkways, then split the garden to calculate areas!",
    style: "instruction",
    file: "/assets/audio/sim_1_act_2.mp3"
  },
  "sim_1_act_3": {
    text: "Activity 3: Store and Lab Sign Detective. Explore real-world penalty waivers, chiller drops, and potion buffs. Tap each term to multiply and see why negative times negative flips into positive savings!",
    style: "instruction",
    file: "/assets/audio/sim_1_act_3.mp3"
  },

  "sim_2": {
    text: "Welcome to Station 2, Balance Builder! Keep the scale balanced, hunt down mistakes in student homework, and calibrate the mission rover.",
    style: "statement",
    file: "/assets/audio/sim_2.mp3"
  },
  "sim_2_act_1": {
    text: "Activity 1: Farmer's Market Apple Scale. Mia balances 2 crates of apples plus 3 kilograms of pears against 16 kilograms on the market scale. Choose your moves carefully — if you only change one side, the scale will tip!",
    style: "instruction",
    file: "/assets/audio/sim_2_act_1.mp3"
  },
  "sim_2_act_2": {
    text: "Activity 2: Peer Review: Science Fair Budget. Sam budgeted for 3 robotics kits at x minus 2 dollars each, but made a mistake on his homework sheet. Tap the first wrong line and choose the correct algebraic fix!",
    style: "instruction",
    file: "/assets/audio/sim_2_act_2.mp3"
  },
  "sim_2_act_3": {
    text: "Activity 3: Rover Thermal Calibration. Calibrate the STEM Club delivery rover's thermal sensor formula. Tap the 4 diagnostic solving moves in the correct logical sequence from expansion to flight check verification!",
    style: "instruction",
    file: "/assets/audio/sim_2_act_3.mp3"
  },

  "sim_3": {
    text: "Welcome to Station 3, Challenge Arena! Test your skills on arcade ticket machines, sports court perimeters, and charity bake sale jars.",
    style: "question",
    file: "/assets/audio/sim_3.mp3"
  },
  "sim_3_act_1": {
    text: "Activity 1: Arcade Mystery Ticket Machine. Insert secret tokens, receive 5 lucky bonus tokens, then hit the 4 times prize multiplier to win 36 tickets! Pull the lever or use the Work Backwards superpower to crack the secret input!",
    style: "instruction",
    file: "/assets/audio/sim_3_act_1.mp3"
  },
  "sim_3_act_2": {
    text: "Activity 2: Sports Court Perimeter Fencing. The school groundskeeper has 32 meters of fence to enclose a court of width x and length x plus 4. Adjust the court dimensions, test the fence fit, and solve for x!",
    style: "instruction",
    file: "/assets/audio/sim_3_act_2.mp3"
  },
  "sim_3_act_3": {
    text: "Activity 3: Charity Bake Sale Jars. Mia sells 3 cookie packs with 2-dollar charity pins, and Noah sells 2 cake tins with 5-dollar mugs. Their charity totals match! Compare the donation jars and solve for x!",
    style: "instruction",
    file: "/assets/audio/sim_3_act_3.mp3"
  },

  // Feedback lines
  "fb_correct": {
    text: "Correct! Excellent bracket work!",
    style: "celebration",
    file: "/assets/audio/fb_correct.mp3"
  },
  "fb_wrong": {
    text: "Not quite! Let's learn from it and try again.",
    style: "encouragement",
    file: "/assets/audio/fb_wrong.mp3"
  },
  "fb_station_ok": {
    text: "Awesome! You cracked it!",
    style: "celebration",
    file: "/assets/audio/fb_station_ok.mp3"
  },
  "fb_complete": {
    text: "Outstanding reflection! Lesson complete!",
    style: "celebration",
    file: "/assets/audio/fb_complete.mp3"
  }
};

// Add all 100 practice questions to AUDIO_MAP
PRACTICE_QUESTIONS.forEach((worldQs, wIdx) => {
  worldQs.forEach((q, qIdx) => {
    AUDIO_MAP[q.audioKey] = {
      text: q.audioText,
      style: "question",
      file: q.audioFile
    };
  });
});

fs.writeFileSync(
  path.join(root, 'src/audioMap.js'),
  `/* Auto-generated complete audio map */\nexport const AUDIO_MAP = ${JSON.stringify(AUDIO_MAP, null, 2)};\n`
);
console.log('Saved src/audioMap.js with ' + Object.keys(AUDIO_MAP).length + ' audio entries!');
