// Assuming the exported objects from settings, tools, blog, users are compatible
// after changing from sqliteTable to pgTable (which they should be)
import * as settings from './settings';
import * as tools from './tools';
import * as blog from './blog';
import * as users from './users';

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
