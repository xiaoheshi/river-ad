import React from 'react';
import { Button } from 'antd';

const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        🎉 River-AD Test Page
      </h1>
      <p className="text-gray-600 mb-4">
        如果你能看到这个页面，说明前端环境配置成功！
      </p>
      <Button type="primary" size="large">
        测试按钮
      </Button>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">✅ 已完成:</h2>
        <ul className="text-green-700 space-y-1">
          <li>• Next.js 项目配置</li>
          <li>• TypeScript 支持</li>
          <li>• Tailwind CSS 样式</li>
          <li>• Ant Design 组件库</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">🚀 下一步:</h2>
        <ul className="text-blue-700 space-y-1">
          <li>• 启动后端服务 (Spring Boot)</li>
          <li>• 连接前后端</li>
          <li>• 测试 API 集成</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;