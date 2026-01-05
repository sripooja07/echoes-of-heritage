import { Globe, Users, Mic, BookOpen } from "lucide-react";

const impacts = [
  {
    icon: Globe,
    value: "150+",
    label: "Languages Archived",
    description: "Digital preservation of endangered languages from around the world",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Community Members",
    description: "Native speakers, learners, and researchers working together",
  },
  {
    icon: Mic,
    value: "50,000+",
    label: "Audio Recordings",
    description: "Words, phrases, stories, and songs captured for future generations",
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Learning Modules",
    description: "Interactive lessons helping communities reconnect with their heritage",
  },
];

const ImpactSection = () => {
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
              <div
                key={index}
                className="group relative text-center animate-fade-in"
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
                </div>
              </div>
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
    </section>
  );
};

export default ImpactSection;
