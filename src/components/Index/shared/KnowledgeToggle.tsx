import { Button } from "@/components/ui/button";
import { useFestivalSet } from "../FestivalSetContext";
import { Eye, EyeOff } from "lucide-react";

export function KnowledgeToggle() {
  const { set, userKnowledge, onKnowledgeToggle, onAuthRequired } =
    useFestivalSet();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleKnowledgeToggle}
      className={`p-1 h-6 w-6 ${
        userKnowledge
          ? "text-purple-400 hover:text-purple-300"
          : "text-purple-600 hover:text-purple-500"
      }`}
      title={userKnowledge ? "I know this artist" : "Mark as known"}
    >
      {userKnowledge ? (
        <Eye className="h-3 w-3" />
      ) : (
        <EyeOff className="h-3 w-3" />
      )}
    </Button>
  );

  async function handleKnowledgeToggle() {
    const result = await onKnowledgeToggle(set.id);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  }
}
