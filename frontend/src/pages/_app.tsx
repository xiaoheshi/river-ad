import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ConfigProvider, App } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-cn';
import '@/utils/i18n';
import '@/styles/globals.css';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set dayjs locale based on i18n language
    if (i18n.language === 'zh') {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }
  }, [i18n.language]);

  // Antd theme configuration
  const theme = {
    token: {
      colorPrimary: '#3b82f6',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#3b82f6',
      borderRadius: 8,
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    components: {
      Button: {
        borderRadius: 8,
        fontWeight: 500,
      },
      Card: {
        borderRadius: 12,
      },
      Input: {
        borderRadius: 8,
      },
      Select: {
        borderRadius: 8,
      },
    },
  };

  // Get Antd locale based on i18n language
  const getAntdLocale = () => {
    return i18n.language === 'zh' ? zhCN : enUS;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider 
        theme={theme}
        locale={getAntdLocale()}
      >
        <App>
          <Component {...pageProps} />
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default MyApp;