import bcrypt from 'bcrypt';

import type { IPurchaseInfo } from '../modules/purchase/purchase-info';
import { addMinutes } from '../utils/date.utils';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

export function toDate(numberAsString: string) {
  return new Date(Number.parseInt(numberAsString, 10));
}

export function isPremium(purchaseInfo: IPurchaseInfo, delayInMinute: number) {
  if (!purchaseInfo.productId) {
    return false;
  }

  const expiresDate = purchaseInfo.expiresDate;

  if (!expiresDate) {
    return false;
  }

  return addMinutes(expiresDate, delayInMinute).getTime() > Date.now();
}

export function removeEmptyQuery(query) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const key of Object.keys(query)) {
    if (query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  }

  return query;
}
