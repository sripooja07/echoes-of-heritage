import { Mic, Brain, BookOpen, Gamepad2, Shield, Cloud } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Recording & Archival",
    description: "Simple microphone-based recording for words, sentences, stories, and folk songs with secure cloud storage.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Brain,
    title: "AI Voice Model Creation",
    description: "Train AI models from native speech to generate natural-sounding voices in endangered languages.",
    gradient: "from-accent to-primary",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Vocabulary lists with audio, sentence examples, storytelling content, and downloadable materials.",
    gradient: "from-primary to-heritage-gold",
  },
  {
    icon: Gamepad2,
    title: "Interactive Learning",
    description: "AI-powered pronunciation feedback, quizzes, mini-games, and progress tracking for all levels.",
    gradient: "from-heritage-gold to-accent",
  },
  {
    icon: Shield,
    title: "Content Management",
    description: "Admin dashboard for managing languages, users, approving recordings, and organizing content.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Cloud,
    title: "Scalable Infrastructure",
    description: "High-fidelity audio capture, speech-to-text, and text-to-speech with cloud-based scalability.",
    gradient: "from-primary to-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Preserve Languages</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A comprehensive platform combining advanced AI technology with intuitive tools for recording, learning, and preserving endangered languages.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative glass-card rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
