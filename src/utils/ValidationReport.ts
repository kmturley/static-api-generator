import { ZodError } from 'zod';
import { logger } from './Logger.js';

export interface ValidationResult {
  id: string;
  type: 'zod' | 'custom';
  passed: boolean;
  message?: string;
  details?: any;
}

export interface ValidationSummary {
  startTime: number;
  endTime?: number;
  duration?: number;
  totalTasks: number;
  passed: number;
  failed: number;
  results: ValidationResult[];
}

export class ValidationReport {
  private summary: ValidationSummary;

  constructor() {
    this.summary = {
      startTime: Date.now(),
      totalTasks: 0,
      passed: 0,
      failed: 0,
      results: [],
    };
  }

  addZodResult(id: string, result: { success: boolean; error?: ZodError }) {
    const validationResult: ValidationResult = {
      id,
      type: 'zod',
      passed: result.success,
      message: result.error?.message,
      details: result.error?.issues,
    };

    this.addResult(validationResult);
  }

  addCustomResult(
    id: string,
    passed: boolean,
    message?: string,
    details?: any,
  ) {
    const validationResult: ValidationResult = {
      id,
      type: 'custom',
      passed,
      message,
      details,
    };

    this.addResult(validationResult);
  }

  private addResult(result: ValidationResult) {
    this.summary.results.push(result);
    this.summary.totalTasks++;

    if (result.passed) {
      this.summary.passed++;
    } else {
      this.summary.failed++;
    }
  }

  finish(): ValidationSummary {
    this.summary.endTime = Date.now();
    this.summary.duration = this.summary.endTime - this.summary.startTime;
    return this.summary;
  }

  getReport(): ValidationSummary {
    return { ...this.summary };
  }

  printSummary() {
    const report = this.finish();
    const duration = report.duration ? `${report.duration}ms` : 'N/A';

    console.log(`\n ${logger['colorize']('❯', 'yellow')} Package Validation`);

    // Show all results with status indicators
    report.results.forEach(r => {
      const status = r.passed
        ? logger['colorize']('✓', 'green')
        : logger['colorize']('×', 'red');
      console.log(`   ${status} ${r.id}`);
    });

    if (report.failed > 0) {
      const separator = '⎯'.repeat(20);
      console.log(
        logger['colorize'](
          `\n${separator} Failed Validations ${report.failed.toString()} ${separator}`,
          'red',
        ),
      );

      report.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`\n${logger['colorize']('FAIL', 'red')} ${r.id}`);
          if (r.type === 'zod' && r.details) {
            r.details.forEach((issue: any) => {
              const path =
                issue.path.length > 0 ? issue.path.join('.') : 'root';
              console.log(
                `${logger['colorize'](`ValidationError: ${path} - ${issue.message}`, 'red')}`,
              );
            });
          } else {
            console.log(
              `${logger['colorize'](`ValidationError: ${r.message || 'Validation failed'}`, 'red')}`,
            );
          }
        });

      console.log(
        logger['colorize'](`\n${separator}${separator}${separator}`, 'red'),
      );
    }

    const failedText =
      report.failed > 0
        ? `${logger['colorize'](report.failed + ' failed', 'red')}`
        : 'all passed';
    const passedText = logger['colorize'](report.passed + ' passed', 'green');

    if (report.failed > 0) {
      console.log(
        `\n   Packages  ${failedText} | ${passedText} (${report.totalTasks})`,
      );
    } else {
      console.log(`\n   Packages  ${passedText} (${report.totalTasks})`);
    }
    console.log(`   Duration  ${duration}\n`);
  }
}
