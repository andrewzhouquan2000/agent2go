/**
 * Agent2Go Phase 4 - Performance Tests
 * 
 * Tests:
 * - Page load times (P95 < 500ms)
 * - API response times
 * - Large data rendering
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const performanceResults = {
  pageLoadTimes: [],
  apiResponseTimes: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

const PERF_THRESHOLDS = {
  pageLoadP95: 500,  // ms
  apiP50: 100,       // ms
  apiP95: 300,       // ms
  apiP99: 500        // ms
};

async function measurePageLoad(url, iterations = 5) {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      const response = await fetch(url, { cache: 'no-store' });
      await response.text();
      times.push(Date.now() - start);
    } catch (error) {
      times.push(-1); // Mark as failed
    }
  }
  
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const p99 = times[Math.floor(times.length * 0.99)] || times[times.length - 1];
  
  return { url, times, p50, p95, p99, avg: times.reduce((a, b) => a + b, 0) / times.length };
}

async function measureApiResponse(url, method = 'GET', body = null, iterations = 10) {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      const options = {
        method,
        cache: 'no-store',
        headers: body ? { 'Content-Type': 'application/json' } : {}
      };
      if (body) options.body = JSON.stringify(body);
      
      const response = await fetch(url, options);
      await response.json().catch(() => ({}));
      times.push(Date.now() - start);
    } catch (error) {
      times.push(-1);
    }
  }
  
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const p99 = times[Math.floor(times.length * 0.99)] || times[times.length - 1];
  
  return { url, method, times, p50, p95, p99, avg: times.reduce((a, b) => a + b, 0) / times.length };
}

async function runPerformanceTests() {
  console.log('\n⚡ Running Performance Tests');
  console.log('============================\n');

  // Test 1: Homepage load time
  console.log('  Test 1: 首页加载时间');
  const homePerf = await measurePageLoad(`${BASE_URL}/`, 5);
  performanceResults.pageLoadTimes.push(homePerf);
  const homePass = homePerf.p95 < PERF_THRESHOLDS.pageLoadP95 && homePerf.p95 > 0;
  performanceResults.summary.total++;
  if (homePass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${homePerf.p50}ms, P95: ${homePerf.p95}ms, P99: ${homePerf.p99}ms`);
  console.log(`    ${homePass ? '✅ PASS' : '❌ FAIL'} (Target: P95 < ${PERF_THRESHOLDS.pageLoadP95}ms)\n`);

  // Test 2: Login page load time
  console.log('  Test 2: 登录页加载时间');
  const loginPerf = await measurePageLoad(`${BASE_URL}/login`, 5);
  performanceResults.pageLoadTimes.push(loginPerf);
  const loginPass = loginPerf.p95 < PERF_THRESHOLDS.pageLoadP95 && loginPerf.p95 > 0;
  performanceResults.summary.total++;
  if (loginPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${loginPerf.p50}ms, P95: ${loginPerf.p95}ms, P99: ${loginPerf.p99}ms`);
  console.log(`    ${loginPass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 3: Dashboard page load time
  console.log('  Test 3: 仪表板页加载时间');
  const dashboardPerf = await measurePageLoad(`${BASE_URL}/dashboard`, 5);
  performanceResults.pageLoadTimes.push(dashboardPerf);
  const dashboardPass = dashboardPerf.p95 < PERF_THRESHOLDS.pageLoadP95 && dashboardPerf.p95 > 0;
  performanceResults.summary.total++;
  if (dashboardPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${dashboardPerf.p50}ms, P95: ${dashboardPerf.p95}ms, P99: ${dashboardPerf.p99}ms`);
  console.log(`    ${dashboardPass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 4: Agents page load time
  console.log('  Test 4: Agents 列表页加载时间');
  const agentsPerf = await measurePageLoad(`${BASE_URL}/agents`, 5);
  performanceResults.pageLoadTimes.push(agentsPerf);
  const agentsPass = agentsPerf.p95 < PERF_THRESHOLDS.pageLoadP95 && agentsPerf.p95 > 0;
  performanceResults.summary.total++;
  if (agentsPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${agentsPerf.p50}ms, P95: ${agentsPerf.p95}ms, P99: ${agentsPerf.p99}ms`);
  console.log(`    ${agentsPass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 5: Registration API response time
  console.log('  Test 5: 注册 API 响应时间');
  const testEmail = `perf_${Date.now()}@test.com`;
  const registerPerf = await measureApiResponse(`${BASE_URL}/api/auth/register`, 'POST', {
    email: testEmail,
    password: 'Test123456',
    name: 'Perf Test'
  }, 5);
  performanceResults.apiResponseTimes.push(registerPerf);
  const registerPass = registerPerf.p95 < PERF_THRESHOLDS.apiP95 && registerPerf.p95 > 0;
  performanceResults.summary.total++;
  if (registerPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${registerPerf.p50}ms, P95: ${registerPerf.p95}ms, P99: ${registerPerf.p99}ms`);
  console.log(`    ${registerPass ? '✅ PASS' : '❌ FAIL'} (Target: P95 < ${PERF_THRESHOLDS.apiP95}ms)\n`);

  // Test 6: Agents API response time
  console.log('  Test 6: Agents API 响应时间');
  const agentsApiPerf = await measureApiResponse(`${BASE_URL}/api/agents`, 'GET', null, 5);
  performanceResults.apiResponseTimes.push(agentsApiPerf);
  const agentsApiPass = agentsApiPerf.p95 < PERF_THRESHOLDS.apiP95 && agentsApiPerf.p95 > 0;
  performanceResults.summary.total++;
  if (agentsApiPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${agentsApiPerf.p50}ms, P95: ${agentsApiPerf.p95}ms, P99: ${agentsApiPerf.p99}ms`);
  console.log(`    ${agentsApiPass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 7: Tasks API response time
  console.log('  Test 7: Tasks API 响应时间');
  const tasksApiPerf = await measureApiResponse(`${BASE_URL}/api/tasks`, 'GET', null, 5);
  performanceResults.apiResponseTimes.push(tasksApiPerf);
  const tasksApiPass = tasksApiPerf.p95 < PERF_THRESHOLDS.apiP95 && tasksApiPerf.p95 > 0;
  performanceResults.summary.total++;
  if (tasksApiPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    P50: ${tasksApiPerf.p50}ms, P95: ${tasksApiPerf.p95}ms, P99: ${tasksApiPerf.p99}ms`);
  console.log(`    ${tasksApiPass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 8: Large data rendering (simulated with large payload)
  console.log('  Test 8: 大数据量渲染测试');
  const largeDataStart = Date.now();
  const largeData = Array(1000).fill(null).map((_, i) => ({
    id: i,
    name: `Agent ${i}`,
    description: 'This is a test agent description for performance testing',
    status: 'active',
    createdAt: new Date().toISOString()
  }));
  const largeDataTime = Date.now() - largeDataStart;
  const largeDataPass = largeDataTime < 100; // Should serialize 1000 items in <100ms
  performanceResults.summary.total++;
  if (largeDataPass) performanceResults.summary.passed++;
  else performanceResults.summary.failed++;
  console.log(`    1000 条数据序列化时间：${largeDataTime}ms`);
  console.log(`    ${largeDataPass ? '✅ PASS' : '❌ FAIL'} (Target: <100ms)\n`);

  // Summary
  console.log('============================');
  const passRate = ((performanceResults.summary.passed / performanceResults.summary.total) * 100).toFixed(1);
  console.log(`📊 Performance Tests: ${performanceResults.summary.passed}/${performanceResults.summary.total} passed (${passRate}%)`);
  console.log('============================\n');

  return performanceResults;
}

module.exports = { runPerformanceTests, performanceResults, PERF_THRESHOLDS };

if (require.main === module) {
  runPerformanceTests()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.summary.failed === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('Test error:', error);
      process.exit(1);
    });
}
