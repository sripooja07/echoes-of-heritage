import { useState } from "react";
import { Globe, Users, Mic, BookOpen, LucideIcon } from "lucide-react";
import ImpactDialog from "@/components/dialogs/ImpactDialog";

interface Impact {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
  details: string;
  stats: { label: string; value: string }[];
}

const impacts: Impact[] = [
  {
    icon: Globe,
    value: "150+",
    label: "Languages Archived",
    description: "Digital preservation of endangered languages from around the world",
    details: "Our archive spans languages from every continent, including critically endangered languages with fewer than 100 speakers remaining. Each language is documented with audio recordings, transcriptions, and cultural context.",
    stats: [
      { label: "Continents", value: "6" },
      { label: "Countries", value: "45" },
      { label: "Critically Endangered", value: "32" },
      { label: "Growing Monthly", value: "5+" },
    ],
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Community Members",
    description: "Native speakers, learners, and researchers working together",
    details: "Our community includes elders preserving their mother tongue, youth reconnecting with heritage, academic researchers, and volunteers from around the world. Together, we're building the largest collaborative language preservation network.",
    stats: [
      { label: "Native Speakers", value: "4,500+" },
      { label: "Active Learners", value: "3,200+" },
      { label: "Researchers", value: "850+" },
      { label: "Volunteers", value: "1,500+" },
    ],
  },
  {
    icon: Mic,
    value: "50,000+",
    label: "Audio Recordings",
    description: "Words, phrases, stories, and songs captured for future generations",
    details: "Every recording is a piece of cultural heritage preserved forever. Our archive includes everyday vocabulary, traditional stories, folk songs, ceremonial language, and conversations that capture the living essence of each language.",
    stats: [
      { label: "Words & Phrases", value: "35K+" },
      { label: "Stories", value: "8K+" },
      { label: "Songs", value: "4K+" },
      { label: "Conversations", value: "3K+" },
    ],
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Learning Modules",
    description: "Interactive lessons helping communities reconnect with their heritage",
    details: "From beginner vocabulary to advanced grammar, our learning modules are designed with community input to ensure cultural authenticity. Each module includes audio from native speakers, interactive exercises, and cultural context.",
    stats: [
      { label: "Beginner Courses", value: "180+" },
      { label: "Intermediate", value: "200+" },
      { label: "Advanced", value: "120+" },
      { label: "Cultural Context", value: "75+" },
    ],
  },
];

const ImpactSection = () => {
  const [selectedImpact, setSelectedImpact] = useState<Impact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImpactClick = (impact: Impact) => {
    setSelectedImpact(impact);
    setDialogOpen(true);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Impact</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Making a <span className="text-gradient">Real Difference</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every recording, every lesson, every community member contributes to preserving humanity's linguistic heritage.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <button
                key={index}
                onClick={() => handleImpactClick(impact)}
                className="group relative text-center animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="glass-card rounded-2xl p-8 h-full hover:border-primary/30 transition-all duration-500">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Value */}
                  <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                    {impact.value}
                  </div>

                  {/* Label */}
                  <div className="font-semibold text-foreground mb-3">
                    {impact.label}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {impact.description}
                  </p>

                  {/* Click hint */}
                  <span className="text-xs text-primary/60 mt-4 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click for details →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quote Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <blockquote className="glass-card rounded-2xl p-8 md:p-12 text-center">
            <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
              "When we lose a language, we lose a unique way of seeing the world. Every language is a treasure trove of human knowledge and culture."
            </p>
            <cite className="text-primary font-medium">— UNESCO Declaration on Languages</cite>
          </blockquote>
        </div>
      </div>

      <ImpactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        impact={selectedImpact}
      />
    </section>
  );
};

export default ImpactSection;
