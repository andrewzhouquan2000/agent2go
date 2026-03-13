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

  // Generate a consistent gradient based on name
  const getGradient = (name: string) => {
    const gradients = [
      "from-blue-100 to-blue-200",
      "from-purple-100 to-purple-200",
      "from-green-100 to-green-200",
      "from-pink-100 to-pink-200",
      "from-orange-100 to-orange-200",
      "from-yellow-100 to-yellow-200",
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14 flex-shrink-0">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback className={`text-sm bg-gradient-to-br ${getGradient(name)}`}>
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold truncate">{displayName}</CardTitle>
          <CardDescription className="capitalize text-xs truncate">{name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {capabilities.map((cap) => (
            <Badge key={cap} variant="secondary" className="text-xs rounded-full">
              {cap}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
