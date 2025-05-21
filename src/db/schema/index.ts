import { settings } from './settings';
import { tools } from './tools';
import { blog } from './blog';
import { users } from './users';

export * from './settings';
export * from './tools';
export * from './blog';
export * from './users';

// Export all schema tables
export const schema = {
  ...settings,
  ...tools,
  ...blog,
  ...users,
};
