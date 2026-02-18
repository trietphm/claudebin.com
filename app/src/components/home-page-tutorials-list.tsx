import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import { Backdrop } from "@/components/ui/backdrop";
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video } from "@/components/ui/video";

type HomePageTutorialsListProps = ComponentProps<"section">;

const tutorials = [
  {
    id: "installation",
    title: "home.installation",
    src: "/videos/installation.webm",
    poster: "/images/poster-installation-1210x680.webp",
  },
  {
    id: "howToUse",
    title: "home.howToUse",
    src: "/videos/how-to-use.webm",
    poster: "/images/poster-how-to-use-1210x680.webp",
  },
] as const;

const HomePageTutorialsList = ({ ...props }: HomePageTutorialsListProps) => {
  const t = useTranslations();

  return (
    <Container as="section" size="lg" {...props}>
      <Tabs defaultValue="installation" className="flex flex-col items-center gap-8">
        <Backdrop size="half" spacing="md" className="sm:px-4 lg:px-12">
          <div className="mx-auto w-full max-w-6xl rounded-3xl border border-gray-500/20 bg-gray-200/50 p-2">
            {tutorials.map((tutorial) => (
              <TabsContent key={tutorial.id} value={tutorial.id}>
                <Video src={tutorial.src} poster={tutorial.poster} className="rounded-2xl" />
              </TabsContent>
            ))}
          </div>
        </Backdrop>

        <TabsList>
          {tutorials.map((tutorial) => (
            <TabsTrigger key={tutorial.id} value={tutorial.id}>
              {t(tutorial.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Container>
  );
};

export { HomePageTutorialsList };
