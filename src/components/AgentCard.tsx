import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentCardProps {
  name: string;
  displayName: string;
  description: string;
  capabilities: string[];
  avatar?: string;
}

export default function AgentCard({
  name,
  displayName,
  description,
  capabilities,
  avatar,
}: AgentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{displayName}</CardTitle>
          <CardDescription className="capitalize">{name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {capabilities.map((cap) => (
            <Badge key={cap} variant="secondary">
              {cap}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
