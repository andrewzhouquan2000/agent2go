'use client';

import { useEffect, useState } from 'react';
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

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scenarios')
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data.scenarios || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load scenarios:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载场景中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 选择你的 AI 梦之队场景
          </h1>
          <p className="text-xl text-gray-600">
            从 OpenClaw 专家库中自动组建专业团队，完成真实业务任务
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Card Header */}
              <div
                className="p-6"
                style={{ backgroundColor: scenario.color || '#6366F1' }}
              >
                <div className="text-4xl mb-3">{scenario.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {scenario.name}
                </h3>
                <p className="text-white/90">{scenario.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Experts */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    推荐专家
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.experts.map((expert) => (
                      <span
                        key={expert}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {expert.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">预计时间</p>
                    <p className="font-semibold text-gray-900">
                      {scenario.estimatedTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">价格</p>
                    <p className="font-semibold text-purple-600">
                      ¥{scenario.price}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/scenarios/${scenario.id}`}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  组建梦之队 →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {scenarios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无可用场景</p>
          </div>
        )}
      </div>
    </div>
  );
}
