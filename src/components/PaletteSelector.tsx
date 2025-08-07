import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Palette = "warm-earth" | "festival-sunset" | "deep-ocean";

interface PaletteOption {
  id: Palette;
  name: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const paletteOptions: PaletteOption[] = [
  {
    id: "warm-earth",
    name: "Warm Earth",
    description: "Sophisticated taupe and teal",
    gradientFrom: "#9d9484",
    gradientTo: "#91c8ce",
  },
  {
    id: "festival-sunset",
    name: "Festival Sunset",
    description: "Vibrant orange and coral",
    gradientFrom: "#d4a574",
    gradientTo: "#e67e80",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    description: "Cool navy and blue",
    gradientFrom: "#2d3748",
    gradientTo: "#1a365d",
  },
];

export const PaletteSelector = () => {
  const [currentPalette, setCurrentPalette] = useState<Palette>("warm-earth");

  useEffect(() => {
    // Load saved palette from localStorage
    const saved = localStorage.getItem("app-palette") as Palette;
    if (saved && paletteOptions.find((p) => p.id === saved)) {
      setCurrentPalette(saved);
      document.documentElement.setAttribute("data-palette", saved);
    } else {
      // Set default palette
      document.documentElement.setAttribute("data-palette", "warm-earth");
    }
  }, []);

  const changePalette = (palette: Palette) => {
    setCurrentPalette(palette);
    document.documentElement.setAttribute("data-palette", palette);
    localStorage.setItem("app-palette", palette);
  };

  const currentPaletteOption = paletteOptions.find(
    (p) => p.id === currentPalette,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">
            {currentPaletteOption?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {paletteOptions.map((palette) => (
          <DropdownMenuItem
            key={palette.id}
            onClick={() => changePalette(palette.id)}
            className="flex items-center justify-between p-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${palette.gradientFrom}, ${palette.gradientTo})`,
                }}
              />
              <div>
                <div className="font-medium">{palette.name}</div>
                <div className="text-xs text-muted-foreground">
                  {palette.description}
                </div>
              </div>
            </div>
            {currentPalette === palette.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
