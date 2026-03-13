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
      <CardHeader className="flex flex-row items-center gap-3 sm:gap-4">
        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback className="text-sm sm:text-base">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base sm:text-lg truncate">{displayName}</CardTitle>
          <CardDescription className="capitalize text-xs sm:text-sm truncate">{name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {capabilities.map((cap) => (
            <Badge key={cap} variant="secondary" className="text-xs">
              {cap}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
