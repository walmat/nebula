import { AssertionError } from 'assert';

// eslint-disable-next-line prettier/prettier
export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message: msg });
  }
}

export function assertIsDefined<T>(
  val: T,
  message?: string
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError({
      message: message || `Expected 'val' to be defined, but received ${val}`
    });
  }
}
