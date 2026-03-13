"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

interface TeamBuilderProps {
  availableAgents: Agent[];
}

export default function TeamBuilder({ availableAgents }: TeamBuilderProps) {
  const [teamName, setTeamName] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleCreateTeam = () => {
    // TODO: Implement team creation logic
    console.log("Creating team:", { teamName, selectedAgents });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">组建您的 AI 团队</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          选择 AI Agent 并配置他们的角色
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="team-name" className="text-sm">团队名称</Label>
          <Input
            id="team-name"
            placeholder="例如：市场研究团队"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="h-11 text-base"
          />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Label className="text-sm">选择 Agent</Label>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {availableAgents.map((agent) => (
              <div
                key={agent.id}
                className={`flex items-center justify-between rounded-lg border p-3 sm:p-4 cursor-pointer transition-colors min-h-[60px] sm:min-h-[64px] ${
                  selectedAgents.includes(agent.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
                onClick={() => toggleAgent(agent.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-sm sm:text-base truncate">{agent.displayName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {agent.description}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${
                    selectedAgents.includes(agent.id)
                      ? "bg-primary border-primary"
                      : "border-input"
                  }`}
                >
                  {selectedAgents.includes(agent.id) && (
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleCreateTeam}
          disabled={!teamName || selectedAgents.length === 0}
          className="w-full h-11 text-base"
        >
          创建团队 ({selectedAgents.length} 个 Agent)
        </Button>
      </CardContent>
    </Card>
  );
}
