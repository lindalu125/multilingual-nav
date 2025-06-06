import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // 提供翻译消息
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});