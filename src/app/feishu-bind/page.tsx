'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FeishuBindPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userInfo, setUserInfo] = useState<{ name?: string; userId?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const name = searchParams.get('name');
    const userId = searchParams.get('user_id');
    const errorMsg = searchParams.get('error');

    if (success === 'true') {
      setStatus('success');
      setUserInfo({ name: name || undefined, userId: userId || undefined });
    } else if (success === 'false') {
      setStatus('error');
      setError(errorMsg || 'Authorization failed');
    }
  }, [searchParams]);

  const handleBindFeishu = () => {
    // Redirect to Feishu OAuth
    window.location.href = '/api/feishu/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          绑定飞书账号
        </h1>

        {status === 'idle' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">
              绑定您的飞书账号以接收 Agent2Go 机器人的消息通知
            </p>
            <button
              onClick={handleBindFeishu}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              绑定飞书
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在跳转到飞书授权页面...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">绑定成功！</h2>
              {userInfo?.name && (
                <p className="text-gray-600">欢迎，{userInfo.name}</p>
              )}
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              返回仪表盘
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">绑定失败</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button
              onClick={() => router.push('/feishu-bind')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">绑定后可用功能：</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 接收 Agent2Go 机器人消息</li>
            <li>• 在飞书群聊中与机器人互动</li>
            <li>• 实时任务通知和更新</li>
            <li>• 多角色机器人协作（CEO/Researcher/Coder/Designer）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
