import { DPExecutionEvent, TransitionCandidate } from '../types';

export interface LCSResult {
  events: DPExecutionEvent[];
  lcsString: string;
}

/**
 * LONGEST COMMON SUBSEQUENCE (LCS) 2D TABULATION & RECONSTRUCTION
 */
export function generateLCSEvents(text1: string, text2: string): LCSResult {
  const events: DPExecutionEvent[] = [];
  let step = 0;
  const m = text1.length;
  const n = text2.length;

  // dp[i][j] = LCS length for text1[0..i-1] and text2[0..j-1]
  const dp: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(null)
  );

  const snap = () => dp.map(r => [...r]);

  events.push({
    step: ++step,
    type: 'STEP_START',
    title: 'Initialize LCS Matrix',
    explanation: `Create an (${m + 1} x ${n + 1}) matrix. dp[i][j] stores the length of the Longest Common Subsequence between text1[0..${m-1}] ("${text1}") and text2[0..${n-1}] ("${text2}").`,
    codeLine: 1,
    tableSnapshot: snap(),
    variables: { text1, text2, m, n }
  });

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = 0;
  for (let j = 0; j <= n; j++) dp[0][j] = 0;

  events.push({
    step: ++step,
    type: 'BASE_CASE_HIT',
    title: 'Base Cases: Empty Subsequences',
    explanation: 'If either string is empty (length 0), the LCS length is 0. Set row 0 and column 0 to 0.',
    coords: { row: 0, col: 0 },
    codeLine: 2,
    tableSnapshot: snap()
  });

  for (let i = 1; i <= m; i++) {
    const char1 = text1[i - 1];
    for (let j = 1; j <= n; j++) {
      const char2 = text2[j - 1];

      if (char1 === char2) {
        // Characters match! Diagonal dependency
        const diagVal = dp[i - 1][j - 1]!;
        const newVal = diagVal + 1;

        const candidates: TransitionCandidate[] = [
          {
            choice: `Characters Match ('${char1}' == '${char2}')`,
            expression: `1 + dp[${i-1}][${j-1}] = 1 + ${diagVal} = ${newVal}`,
            value: newVal,
            sourceCoords: { row: i - 1, col: j - 1 }
          }
        ];

        events.push({
          step: ++step,
          type: 'DEPENDENCY_READ',
          title: `Match Found at (${i},${j}): '${char1}' == '${char2}'`,
          explanation: `Characters match! The optimal solution extends the LCS of prefixes text1[0..${i-2}] and text2[0..${j-2}] by 1. Read diagonal cell dp[${i-1}][${j-1}].`,
          coords: { row: i, col: j },
          dependencies: [{ row: i - 1, col: j - 1, label: `Diagonal: ${diagVal}` }],
          candidates,
          codeLine: 4,
          tableSnapshot: snap(),
          variables: { char1, char2, diagVal }
        });

        dp[i][j] = newVal;
        events.push({
          step: ++step,
          type: 'CELL_SET',
          title: `dp[${i}][${j}] = ${newVal}`,
          explanation: `Take diagonal cell + 1: dp[${i}][${j}] = ${newVal}.`,
          coords: { row: i, col: j },
          selectedValue: newVal,
          codeLine: 5,
          tableSnapshot: snap(),
          variables: { [`dp[${i}][${j}]`]: newVal }
        });
      } else {
        // Characters differ: Max of top and left
        const topVal = dp[i - 1][j]!;
        const leftVal = dp[i][j - 1]!;

        const candidates: TransitionCandidate[] = [
          {
            choice: `Skip '${char1}' from text1 (Take Top)`,
            expression: `dp[${i-1}][${j}] = ${topVal}`,
            value: topVal,
            sourceCoords: { row: i - 1, col: j }
          },
          {
            choice: `Skip '${char2}' from text2 (Take Left)`,
            expression: `dp[${i}][${j-1}] = ${leftVal}`,
            value: leftVal,
            sourceCoords: { row: i, col: j - 1 }
          }
        ];

        events.push({
          step: ++step,
          type: 'DEPENDENCY_READ',
          title: `Mismatch at (${i},${j}): '${char1}' != '${char2}'`,
          explanation: `Characters do not match. Compare dropping '${char1}' from text1 (top cell: ${topVal}) vs dropping '${char2}' from text2 (left cell: ${leftVal}).`,
          coords: { row: i, col: j },
          dependencies: [
            { row: i - 1, col: j, label: `Top: ${topVal}` },
            { row: i, col: j - 1, label: `Left: ${leftVal}` }
          ],
          candidates,
          codeLine: 7,
          tableSnapshot: snap(),
          variables: { char1, char2, topVal, leftVal }
        });

        const best = Math.max(topVal, leftVal);
        const decision = topVal >= leftVal ? 'Take Top' : 'Take Left';

        dp[i][j] = best;
        events.push({
          step: ++step,
          type: 'CELL_SET',
          title: `dp[${i}][${j}] = max(${topVal}, ${leftVal}) = ${best}`,
          explanation: `Decision: ${decision}. dp[${i}][${j}] set to ${best}.`,
          coords: { row: i, col: j },
          selectedValue: best,
          codeLine: 8,
          tableSnapshot: snap(),
          variables: { [`dp[${i}][${j}]`]: best }
        });
      }
    }
  }

  // RECONSTRUCTION
  let ci = m;
  let cj = n;
  const lcsChars: string[] = [];
  const reconstructionPath: { row: number; col: number; value: any }[] = [];

  events.push({
    step: ++step,
    type: 'RECONSTRUCTION_STEP',
    title: 'Begin LCS String Reconstruction',
    explanation: `Trace back from dp[${m}][${n}] = ${dp[m][n]} to extract the exact characters of the Longest Common Subsequence.`,
    coords: { row: ci, col: cj },
    reconstructedPath: [...reconstructionPath],
    codeLine: 10,
    tableSnapshot: snap()
  });

  while (ci > 0 && cj > 0) {
    reconstructionPath.push({ row: ci, col: cj, value: dp[ci][cj] });

    if (text1[ci - 1] === text2[cj - 1]) {
      lcsChars.push(text1[ci - 1]);
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Matched Character: '${text1[ci - 1]}'`,
        explanation: `text1[${ci-1}] == text2[${cj-1}] ('${text1[ci-1]}'). This character belongs in the LCS! Move diagonally to (${ci-1}, ${cj-1}).`,
        coords: { row: ci - 1, col: cj - 1 },
        dependencies: [{ row: ci, col: cj }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 11,
        tableSnapshot: snap(),
        variables: { matchedChar: text1[ci - 1], currentLCS: lcsChars.slice().reverse().join('') }
      });
      ci--;
      cj--;
    } else if (dp[ci - 1][cj]! >= dp[ci][cj - 1]!) {
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Move Up (Skip '${text1[ci-1]}' from text1)`,
        explanation: `Top cell (${dp[ci-1][cj]}) >= Left cell (${dp[ci][cj-1]}). Move up to row ${ci-1}.`,
        coords: { row: ci - 1, col: cj },
        dependencies: [{ row: ci, col: cj }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 13,
        tableSnapshot: snap()
      });
      ci--;
    } else {
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Move Left (Skip '${text2[cj-1]}' from text2)`,
        explanation: `Left cell (${dp[ci][cj-1]}) > Top cell (${dp[ci-1][cj]}). Move left to col ${cj-1}.`,
        coords: { row: ci, col: cj - 1 },
        dependencies: [{ row: ci, col: cj }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 15,
        tableSnapshot: snap()
      });
      cj--;
    }
  }

  const finalLCS = lcsChars.reverse().join('');
  events.push({
    step: ++step,
    type: 'COMPLETED',
    title: `LCS Result: "${finalLCS}" (Length: ${dp[m][n]})`,
    explanation: `The Longest Common Subsequence of "${text1}" and "${text2}" is "${finalLCS}".`,
    coords: { row: m, col: n },
    selectedValue: finalLCS,
    reconstructedPath: [...reconstructionPath],
    codeLine: 16,
    tableSnapshot: snap(),
    variables: { lcsString: finalLCS, length: dp[m][n] }
  });

  return {
    events,
    lcsString: finalLCS
  };
}

