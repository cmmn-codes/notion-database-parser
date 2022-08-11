import {
  DatabaseResult,
  PartialDatabaseResult,
  PartialUserObjectResponse,
  UserObjectResponse,
} from './type-hacks.js';

/**
 * @returns `true` if `response` is a full `UserObjectResponse`.
 */
export function isFullUser(
  response: PartialUserObjectResponse | UserObjectResponse
): response is UserObjectResponse {
  return 'type' in response;
}

/**
 * @returns `true` if `response` is a full `DatabaseResult`.
 */
export function isFullDatabaseObject(
  response: PartialDatabaseResult | DatabaseResult
): response is DatabaseResult {
  return 'properties' in response;
}
