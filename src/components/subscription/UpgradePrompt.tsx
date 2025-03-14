
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  showButton?: boolean;
}

const UpgradePrompt = ({
  title = "Pro Feature",
  description = "This feature requires a Lifted Pro subscription.",
  showButton = true
}: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-amber-400/30 bg-gradient-to-br from-amber-50/30 to-background dark:from-amber-950/20 text-center">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Crown className="h-6 w-6 text-amber-600 dark:text-amber-500" />
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span>Weight Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span>Advanced Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span>Unlimited Workouts</span>
          </div>
        </div>
      </CardContent>
      {showButton && (
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/settings/subscription")}>
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UpgradePrompt;
