"use client";

import * as React from "react";
import { Upload, Palette, Type, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const defaultColors = [
  { name: "Primary", value: "#6366f1" },
  { name: "Secondary", value: "#8b5cf6" },
  { name: "Accent", value: "#06b6d4" },
  { name: "Background", value: "#09090b" },
];

export default function BrandPage() {
  const [colors, setColors] = React.useState(defaultColors);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Brand Kit
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize the look and feel of your published content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Upload your company logo for branding your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Primary Logo</p>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-muted/30 transition-colors hover:border-zinc-500">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-6 w-6 text-zinc-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drop your logo here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG or JPG (max 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Logo Mark (Icon)
              </p>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-muted/30 transition-colors hover:border-zinc-500">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-6 w-6 text-zinc-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drop your icon here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Square format, min 128x128
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Brand Colors
          </CardTitle>
          <CardDescription>
            Define your brand palette for consistent styling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color, index) => (
              <div key={color.name} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {color.name}
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <Input
                    value={color.value}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[index] = { ...color, value: e.target.value };
                      setColors(updated);
                    }}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </CardTitle>
          <CardDescription>
            Choose fonts for your published content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Heading Font
              </label>
              <Input defaultValue="Inter" placeholder="Font family name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Body Font
              </label>
              <Input defaultValue="Inter" placeholder="Font family name" />
            </div>
          </div>

          <Separator />

          {/* Preview */}
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Preview</p>
            <div className="rounded-xl border border-border bg-muted/30 p-6">
              <h2 className="text-xl font-bold text-foreground">
                Heading Example
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                This is how your body text will appear in published guides and
                knowledge base articles. The typography settings help maintain
                consistent branding across all your content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
