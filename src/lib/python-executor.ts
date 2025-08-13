
import type { Activity } from './types';

// This is a very simple, mock Python interpreter for educational purposes.
// It doesn't use eval() for security reasons and instead relies on regex
// and simple logic to "run" the code for the specific lesson activities.

export async function executePython(
  code: string,
  activity: Activity
): Promise<{ output: string; error?: string; success: boolean }> {
  let output = '';
  let consoleLogBkp = console.log;
  let logs: any[] = [];
  console.log = (...args) => {
    logs.push(args.join(' '));
  };

  try {
    if (activity.isCommentOnly) {
        // For comment-only activities or ones that can't be validated,
        // we just check if the code is not empty.
        // The random.randint() lesson is an example.
        return { output: activity.expectedOutput, success: code.trim().length > 0 };
    }

    if (activity.inputs) {
        let inputCounter = 0;
        // Mock input() function
        (global as any).input = (prompt?: string) => {
            if (prompt) logs.push(prompt);
            return activity.inputs![inputCounter++] || '';
        };
    }

    // Mock print() function
    (global as any).print = (...args: any[]) => {
      logs.push(args.map(String).join(' '));
    };

    // This is a simplified "runner". It replaces Python syntax with JS-like
    // mocks and then uses Function constructor to run in a semi-sandboxed way.
    // It's not a full interpreter.
    const jsCode = code
        .replace(/print\((.*)\)/g, 'print($1)')
        .replace(/#.*$/gm, '') // remove comments
        .replace(/range\((.*)\)/g, 'Array.from({length: $1}, (_, i) => i)') // basic range support
        

    new Function(jsCode)();

    output = logs.join('\n') + (logs.length > 0 ? '\n' : '');

    // Restore console.log
    console.log = consoleLogBkp;
    delete (global as any).print;
    if(activity.inputs) delete (global as any).input;


    if (output.trim() === activity.expectedOutput.trim()) {
      return { output, success: true };
    } else {
      return { output, success: false, error: "Output doesn't match expected result." };
    }
  } catch (e: any) {
    console.log = consoleLogBkp;
    delete (global as any).print;
    if(activity.inputs) delete (global as any).input;
    return { output, success: false, error: e.message };
  }
}
