// src/i18n.ts

import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // 提供翻译消息
  return {
    // 确保这里的路径是 './messages'
    messages: (await import(`./messages/${locale}.json`)).default
  };
});