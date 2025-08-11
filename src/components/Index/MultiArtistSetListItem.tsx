import { SetHeader } from "./shared/SetHeader";
import { SetImage } from "./shared/SetImage";
import { SetMetadata } from "./shared/SetMetadata";
import { SetDescription } from "./shared/SetDescription";
import { SetVotingButtons } from "./shared/SetVotingButtons";

export function MultiArtistSetListItem() {
  return (
    <div
      className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 rounded-lg p-4"
      data-testid="artist-item"
    >
      {/* Mobile Layout (sm and below) */}
      <div className="block md:hidden space-y-3">
        <div className="flex items-start gap-3 relative">
          <SetImage size="sm" />
          <div className="flex-1 min-w-0">
            <SetHeader size="sm" />
            <SetMetadata />
          </div>
        </div>

        <SetDescription className="text-purple-200 text-sm" />

        <SetVotingButtons size="sm" layout="horizontal" />
      </div>

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:flex items-center gap-4 relative">
        <SetImage size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <SetHeader size="sm" />

              <SetMetadata />
            </div>
          </div>

          <SetDescription className="text-purple-200 text-sm mb-2" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <SetVotingButtons size="sm" layout="horizontal" />
        </div>
      </div>
    </div>
  );
}
