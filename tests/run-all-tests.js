#!/usr/bin/env node
/**
 * Agent2Go Phase 4 - Main Test Runner
 * 
 * Orchestrates all test suites and generates reports
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PROJECT_ROOT = path.join(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'test-reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║       Agent2Go Phase 4 - Complete Test Suite              ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log(`\n📍 Base URL: ${BASE_URL}`);
console.log(`📁 Reports: ${REPORTS_DIR}`);
console.log(`🕐 Started: ${new Date().toISOString()}\n`);

// Import test modules
const { runAllTests: runE2ETests, testResults: e2eResults } = require('./e2e/core-user-journeys.test.js');
const { testBoundaryScenarios, boundaryResults } = require('./e2e/boundary-scenarios.test.js');
const { runPerformanceTests, performanceResults } = require('./performance/performance.test.js');

async function runAllTests() {
  const overallResults = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    suites: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      success: true
    }
  };

  try {
    // Run E2E Core User Journeys
    console.log('\n' + '═'.repeat(60));
    console.log('SUITE 1: E2E Core User Journeys');
    console.log('═'.repeat(60));
    const e2eResult = await runE2ETests();
    overallResults.suites.e2e = {
      name: 'E2E Core User Journeys',
      ...e2eResult.summary,
      details: e2eResults
    };
    overallResults.summary.total += e2eResult.summary.total;
    overallResults.summary.passed += e2eResult.summary.passed;
    overallResults.summary.failed += e2eResult.summary.total - e2eResult.summary.passed;

    // Run Boundary Scenarios
    console.log('\n' + '═'.repeat(60));
    console.log('SUITE 2: Boundary Scenarios');
    console.log('═'.repeat(60));
    const boundaryResult = await testBoundaryScenarios();
    overallResults.suites.boundary = {
      name: 'Boundary Scenarios',
      ...boundaryResult.summary,
      details: boundaryResults
    };
    overallResults.summary.total += boundaryResult.summary.total;
    overallResults.summary.passed += boundaryResult.summary.passed;
    overallResults.summary.failed += boundaryResult.summary.failed;

    // Run Performance Tests
    console.log('\n' + '═'.repeat(60));
    console.log('SUITE 3: Performance Tests');
    console.log('═'.repeat(60));
    const perfResult = await runPerformanceTests();
    overallResults.suites.performance = {
      name: 'Performance Tests',
      ...perfResult.summary,
      details: performanceResults
    };
    overallResults.summary.total += perfResult.summary.total;
    overallResults.summary.passed += perfResult.summary.passed;
    overallResults.summary.failed += perfResult.summary.failed;

    // Calculate overall success
    overallResults.summary.success = overallResults.summary.failed === 0;
    overallResults.summary.passRate = ((overallResults.summary.passed / overallResults.summary.total) * 100).toFixed(1);

    return overallResults;
  } catch (error) {
    console.error('\n❌ Test suite error:', error);
    overallResults.summary.error = error.message;
    overallResults.summary.success = false;
    return overallResults;
  }
}

function generateMarkdownReport(results) {
  const timestamp = new Date(results.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  return `# Agent2Go Phase 4 测试报告

**生成时间**: ${timestamp}  
**测试环境**: ${results.baseUrl}  
**总体状态**: ${results.summary.success ? '✅ 通过' : '❌ 失败'}  
**通过率**: ${results.summary.passed}/${results.summary.total} (${results.summary.passRate}%)

---

## 📊 测试总览

| 测试套件 | 通过 | 失败 | 总数 | 状态 |
|----------|------|------|------|------|
| E2E 核心用户旅程 | ${results.suites.e2e?.passed || 0} | ${results.suites.e2e?.total - results.suites.e2e?.passed || 0} | ${results.suites.e2e?.total || 0} | ${results.suites.e2e?.passed === results.suites.e2e?.total ? '✅' : '❌'} |
| 边界场景测试 | ${results.suites.boundary?.passed || 0} | ${results.suites.boundary?.failed || 0} | ${results.suites.boundary?.total || 0} | ${results.suites.boundary?.failed === 0 ? '✅' : '❌'} |
| 性能测试 | ${results.suites.performance?.passed || 0} | ${results.suites.performance?.failed || 0} | ${results.suites.performance?.total || 0} | ${results.suites.performance?.failed === 0 ? '✅' : '❌'} |

---

## 1️⃣ E2E 核心用户旅程测试

### 测试结果详情

${Object.entries(results.suites.e2e?.details || {}).map(([key, journey]) => `
#### ${journey.name}
- **状态**: ${journey.status === 'passed' ? '✅ 通过' : journey.status === 'failed' ? '❌ 失败' : '⏳ 待执行'}
- **耗时**: ${journey.duration}ms
- **步骤**:
${journey.steps?.map(step => `  - ${step.passed ? '✅' : '❌'} ${step.step}: ${step.details}`).join('\n') || 'N/A'}
`).join('\n')}

---

## 2️⃣ 边界场景测试

### 测试结果详情

| 场景 | 状态 | 详情 |
|------|------|------|
${(results.suites.boundary?.details?.scenarios || []).map(s => `| ${s.name} | ${s.passed ? '✅' : '❌'} | ${s.details} |`).join('\n')}

---

## 3️⃣ 性能测试

### 页面加载时间

| 页面 | P50 | P95 | P99 | 平均 | 目标 | 状态 |
|------|-----|-----|-----|------|------|------|
${(results.suites.performance?.details?.pageLoadTimes || []).map(p => `| ${p.url} | ${p.p50}ms | ${p.p95}ms | ${p.p99}ms | ${p.avg.toFixed(0)}ms | <500ms | ${p.p95 < 500 && p.p95 > 0 ? '✅' : '❌'} |`).join('\n')}

### API 响应时间

| API | 方法 | P50 | P95 | P99 | 平均 | 目标 | 状态 |
|-----|------|-----|-----|-----|------|------|------|
${(results.suites.performance?.details?.apiResponseTimes || []).map(a => `| ${a.url} | ${a.method} | ${a.p50}ms | ${a.p95}ms | ${a.p99}ms | ${a.avg.toFixed(0)}ms | <300ms | ${a.p95 < 300 && a.p95 > 0 ? '✅' : '❌'} |`).join('\n')}

---

## ✅ 验收标准检查

### Phase 4 要求

- [ ] 端到端测试：核心流程 100% 覆盖
- [ ] 兼容性测试：目标浏览器 100% 通过
- [ ] 性能测试：所有关键接口 P95 < 500ms
- [ ] 无 Critical/High 级别 Bug

### 测试结果

- **端到端测试覆盖率**: ${results.suites.e2e?.passed === results.suites.e2e?.total ? '✅ 100%' : `⚠️ ${(results.suites.e2e?.passed / results.suites.e2e?.total * 100).toFixed(1)}%`}
- **边界场景通过率**: ${results.suites.boundary?.total ? ((results.suites.boundary.passed / results.suites.boundary.total) * 100).toFixed(1) + '%' : 'N/A'}
- **性能达标率**: ${results.suites.performance?.passed === results.suites.performance?.total ? '✅ 100%' : `⚠️ ${(results.suites.performance?.passed / results.suites.performance?.total * 100).toFixed(1)}%`}

---

## 📝 结论与建议

### 总体评估
${results.summary.success ? '✅ **所有测试通过**，系统符合 Phase 4 验收标准。' : `⚠️ **${results.summary.failed} 个测试失败**，需要修复后重新测试。`}

### 关键发现
${generateFindings(results)}

### 后续行动
1. 修复所有失败的测试用例
2. 更新 BUG_LIST.md
3. 重新运行测试验证修复
4. 准备 Phase 4 验收文档

---

*报告由 Agent2Go 自动化测试系统生成*
`;
}

function generateFindings(results) {
  const findings = [];
  
  if (results.suites.e2e?.passed < results.suites.e2e?.total) {
    findings.push('- E2E 测试中存在失败的用户旅程，需要优先修复');
  }
  
  if (results.suites.boundary?.failed > 0) {
    findings.push('- 边界场景处理需要加强，特别是错误输入和网络异常');
  }
  
  const slowPages = (results.suites.performance?.details?.pageLoadTimes || []).filter(p => p.p95 >= 500);
  if (slowPages.length > 0) {
    findings.push(`- ${slowPages.length} 个页面加载时间未达标，需要优化`);
  }
  
  const slowApis = (results.suites.performance?.details?.apiResponseTimes || []).filter(a => a.p95 >= 300);
  if (slowApis.length > 0) {
    findings.push(`- ${slowApis.length} 个 API 响应时间未达标，需要优化`);
  }
  
  if (findings.length === 0) {
    findings.push('- 系统整体表现良好，无明显性能瓶颈');
    findings.push('- 建议持续监控生产环境性能指标');
  }
  
  return findings.join('\n');
}

// Main execution
(async () => {
  try {
    const results = await runAllTests();
    
    // Generate and save report
    const markdownReport = generateMarkdownReport(results);
    const reportPath = path.join(REPORTS_DIR, 'PHASE4_TEST_REPORT.md');
    fs.writeFileSync(reportPath, markdownReport);
    
    // Save JSON results
    const jsonPath = path.join(REPORTS_DIR, 'test-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    
    console.log('\n' + '═'.repeat(60));
    console.log('📄 测试报告已生成:');
    console.log(`   - Markdown: ${reportPath}`);
    console.log(`   - JSON: ${jsonPath}`);
    console.log('═'.repeat(60));
    
    console.log(`\n${results.summary.success ? '✅' : '❌'} Overall: ${results.summary.passed}/${results.summary.total} tests passed (${results.summary.passRate}%)\n`);
    
    process.exit(results.summary.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
})();
