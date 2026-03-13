'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Scenario {
  id: string;
  name: string;
  description: string;
  experts: string[];
  estimatedTime: string;
  price: number;
  icon?: string;
  color?: string;
}

interface Expert {
  name: string;
  identity: string;
  goal: string;
  backstory: string;
}

export default function ScenarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    // Load scenario
    fetch(`/api/scenarios?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push('/scenarios');
          return;
        }
        setScenario(data);
      })
      .catch((err) => {
        console.error('Failed to load scenario:', err);
        router.push('/scenarios');
      });
  }, [params.id, router]);

  useEffect(() => {
    if (!scenario?.experts) return;

    // Load expert details
    Promise.all(
      scenario.experts.map((name) =>
        fetch(`/api/experts?name=${name}`).then((res) => res.json())
      )
    )
      .then((results) => {
        setExperts(results.filter((e) => !e.error));
      })
      .catch((err) => {
        console.error('Failed to load experts:', err);
      });
  }, [scenario?.experts]);

  const handleExecute = async () => {
    if (!scenario || !userInput.trim()) return;

    setExecuting(true);
    try {
      const response = await fetch('/api/crew/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenario.id,
          userInput: userInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      // Store session ID and redirect to chat
      setSessionId(data.sessionId);
      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Execution error:', error);
      alert('执行失败：' + (error as Error).message);
    } finally {
      setExecuting(false);
    }
  };

  if (loading || !scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/scenarios"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← 返回场景列表
        </Link>

        {/* Scenario Header */}
        <div
          className="rounded-2xl p-8 mb-8 text-white"
          style={{ backgroundColor: scenario.color || '#6366F1' }}
        >
          <div className="text-5xl mb-4">{scenario.icon}</div>
          <h1 className="text-4xl font-bold mb-4">{scenario.name}</h1>
          <p className="text-xl text-white/90">{scenario.description}</p>
        </div>

        {/* Experts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👥 你的梦之队
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.map((expert) => (
              <div
                key={expert.name}
                className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {expert.identity}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {expert.backstory || expert.goal}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">预计时间</p>
            <p className="text-2xl font-bold text-gray-900">
              {scenario.estimatedTime}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">价格</p>
            <p className="text-2xl font-bold text-purple-600">
              ¥{scenario.price}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📝 描述你的需求
          </h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="例如：夏季护肤产品推广、健身打卡挑战、咖啡店开业营销..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleExecute}
            disabled={executing || !userInput.trim()}
            className={`mt-4 w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              executing || !userInput.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {executing ? '🚀 执行中...' : '🚀 开始执行'}
          </button>
        </div>

        {/* Process Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 执行流程
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1️⃣ 选题专家分析热门方向</li>
            <li>2️⃣ 文案专家创作完整内容</li>
            <li>3️⃣ 配图专家生成视觉提示词</li>
            <li>4️⃣ 运营专家制定发布策略</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
