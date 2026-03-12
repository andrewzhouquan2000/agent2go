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
      <CardHeader>
        <CardTitle>组建您的 AI 团队</CardTitle>
        <CardDescription>
          选择 AI Agent 并配置他们的角色
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="team-name">团队名称</Label>
          <Input
            id="team-name"
            placeholder="例如：市场研究团队"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>选择 Agent</Label>
          <div className="grid gap-4 md:grid-cols-2">
            {availableAgents.map((agent) => (
              <div
                key={agent.id}
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedAgents.includes(agent.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
                onClick={() => toggleAgent(agent.id)}
              >
                <div>
                  <p className="font-medium">{agent.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded border flex items-center justify-center ${
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
          className="w-full"
        >
          创建团队 ({selectedAgents.length} 个 Agent)
        </Button>
      </CardContent>
    </Card>
  );
}
