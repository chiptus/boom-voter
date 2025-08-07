import { Music, Calendar, Users, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useFestivalsQuery } from "@/hooks/queries/useFestivalQuery";
import { AppHeader } from "@/components/AppHeader";
import { Festival } from "@/services/queries";
import { useEffect } from "react";

export default function FestivalSelection() {
  const { data: availableFestivals = [], isLoading: festivalsLoading } =
    useFestivalsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!festivalsLoading && availableFestivals.length === 1) {
      navigate(`/festivals/${availableFestivals[0].slug}`);
    }
  }, [availableFestivals, festivalsLoading, navigate]);

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
            <Link
              key={festival.id}
              to={`/festivals/${festival.slug}`}
              className="block"
            >
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
                  {festival.website_url && (
                    <div className="flex items-center gap-2 text-sm text-purple-200">
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">
                        {festival.website_url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/50 text-purple-100 border-purple-500/50"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Music Festival
                    </Badge>

                    <Badge
                      variant="secondary"
                      className="bg-green-600/50 text-green-100 border-green-500/50"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Community Voting
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
