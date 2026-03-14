'use client';

import React from 'react';

export default function TeamTools() {
  const activeTeams = [
    { name: '小程序开发', members: 3, color: 'from-purple-500 to-blue-500' },
    { name: '电商营销', members: 2, color: 'from-green-500 to-teal-500' },
    { name: '品牌升级', members: 4, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <aside className="w-72 bg-white border-l border-gray-200 h-screen fixed right-0 top-0 p-6 overflow-y-auto">
      {/* Create Team Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all mb-6">
        + Create New Team
      </button>

      {/* Active Teams */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Active Teams</h3>
        <div className="space-y-3">
          {activeTeams.map((team) => (
            <div key={team.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${team.color}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{team.name}</p>
                <p className="text-sm text-gray-500">{team.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Quick Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Agents</span>
            <span className="text-sm font-medium">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Active Projects</span>
            <span className="text-sm font-medium">8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tasks Done</span>
            <span className="text-sm font-medium">156</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
