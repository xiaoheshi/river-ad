export default function SimplePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#3B82F6', fontSize: '2rem', marginBottom: '1rem' }}>
        🎉 River-AD 启动成功！
      </h1>
      
      <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2 style={{ color: '#1E40AF' }}>✅ 前端环境已就绪</h2>
        <ul style={{ color: '#1D4ED8' }}>
          <li>Next.js 14 ✓</li>
          <li>TypeScript ✓</li>
          <li>开发服务器运行中 ✓</li>
        </ul>
      </div>
      
      <div style={{ background: '#FFFBEB', padding: '1rem', borderRadius: '8px' }}>
        <h2 style={{ color: '#D97706' }}>⚠️ 待启动服务</h2>
        <ul style={{ color: '#B45309' }}>
          <li>Spring Boot 后端服务 (端口 8080)</li>
          <li>PostgreSQL 数据库</li>
          <li>Redis 缓存</li>
        </ul>
      </div>
      
      <p style={{ marginTop: '2rem', color: '#6B7280' }}>
        访问 <a href="/test" style={{ color: '#3B82F6' }}>/test</a> 查看完整测试页面
      </p>
    </div>
  );
}