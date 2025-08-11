import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SetHeader } from "./shared/SetHeader";
import { SetImage } from "./shared/SetImage";
import { SetMetadata } from "./shared/SetMetadata";
import { SetDescription } from "./shared/SetDescription";
import { SetVotingButtons } from "./shared/SetVotingButtons";

export function SingleArtistSetCard() {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        <SetImage />

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <SetHeader />
            <SetMetadata />
          </div>
        </div>

        <SetDescription />
      </CardHeader>

      <CardContent>
        <SetVotingButtons />
      </CardContent>
    </Card>
  );
}
