import { Music, GlobeIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFestivalsQuery } from "@/hooks/queries/festivals/useFestivals";
import { Festival } from "@/hooks/queries/festivals/types";
import { AppHeader } from "@/components/layout/AppHeader";
import { useEffect } from "react";
import {
  createFestivalSubdomainUrl,
  isMainGetuplineDomain,
} from "@/lib/subdomain";
import { Link } from "react-router-dom";
import { useCustomLinksQuery } from "@/hooks/queries/custom-links/useCustomLinks";

export default function FestivalSelection() {
  const { data: availableFestivals = [], isLoading: festivalsLoading } =
    useFestivalsQuery();

  function handleFestivalClick(festival: Festival) {
    const subdomainUrl = createFestivalSubdomainUrl(festival.slug);
    const isMain = isMainGetuplineDomain();

    if (isMain) {
      window.location.href = subdomainUrl;
    } else {
      window.location.href = `/festivals/${festival.slug}`;
    }
  }

  useEffect(() => {
    if (!festivalsLoading && availableFestivals.length === 1) {
      handleFestivalClick(availableFestivals[0]);
    }
  }, [availableFestivals, festivalsLoading]);

  if (festivalsLoading) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading festivals...</div>
      </div>
    );
  }

  if (availableFestivals.length === 0) {
    return (
      <div className="min-h-screen bg-app-gradient">
        <div className="container mx-auto px-4 py-8">
          <AppHeader
            title="UpLine"
            subtitle="Collaborative Festival Voting"
            description="No festivals are currently available for voting."
          />

          <div className="flex items-center justify-center mt-16">
            <Card className="w-full max-w-md bg-white/10 border-purple-400/30">
              <CardHeader className="text-center">
                <Music className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                <CardTitle className="text-white">
                  No Festivals Available
                </CardTitle>
                <CardDescription className="text-purple-200">
                  There are currently no festivals open for voting. Check back
                  soon!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader
          title="UpLine"
          subtitle="Collaborative Festival Voting"
          description="Choose a festival to start voting and collaborating with your community."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableFestivals.map((festival: Festival) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-purple-200 text-sm">
            Festival organizers can add their events through the admin panel
          </p>
        </div>
      </div>
    </div>
  );
}

function FestivalCard({ festival }: { festival: Festival }) {
  const customLinksQuery = useCustomLinksQuery(festival.id);
  const websiteUrl = customLinksQuery.data?.[0]?.url;

  return (
    <Link className="block cursor-pointer" to={`/festivals/${festival.slug}`}>
      <Card className="bg-white/10 border-purple-400/30 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-xl mb-2 group-hover:text-purple-200 transition-colors">
                {festival.name}
              </CardTitle>
              {festival.description && (
                <CardDescription className="text-purple-200 text-sm">
                  {festival.description}
                </CardDescription>
              )}
            </div>
            <Music className="h-6 w-6 text-purple-400 ml-4" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {websiteUrl && (
            <div className="flex items-center gap-2 text-sm text-purple-200">
              <GlobeIcon className="h-4 w-4" />
              <span className="truncate">
                {websiteUrl.replace(/^https?:\/\//, "")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
