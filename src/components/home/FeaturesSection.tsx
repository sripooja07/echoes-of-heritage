import { useState } from "react";
import { Mic, Brain, BookOpen, Gamepad2, Shield, Cloud, LucideIcon } from "lucide-react";
import FeatureDialog from "@/components/dialogs/FeatureDialog";
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  details: string;
  link: string;
  linkLabel: string;
}
const features: Feature[] = [{
  icon: Mic,
  title: "Voice Recording & Archival",
  description: "Simple microphone-based recording for words, sentences, stories, and folk songs with secure cloud storage.",
  gradient: "from-primary to-accent",
  details: "Our voice recording system captures high-fidelity audio optimized for AI training. Tag your recordings by language, region, age group, and category. All recordings are securely stored in the cloud and can be accessed by researchers and learners worldwide.",
  link: "/record",
  linkLabel: "Start Recording"
}, {
  icon: Brain,
  title: "AI Voice Model Creation",
  description: "Train AI models from native speech to generate natural-sounding voices in endangered languages.",
  gradient: "from-accent to-primary",
  details: "Using state-of-the-art machine learning, we create voice models that can synthesize natural-sounding speech in endangered languages. These models help preserve the authentic sound and intonation patterns of native speakers for future generations.",
  link: "/voice-generator",
  linkLabel: "Try AI Voices"
}, {
  icon: BookOpen,
  title: "Learning Resources",
  description: "Vocabulary lists with audio, sentence examples, storytelling content, and downloadable materials.",
  gradient: "from-primary to-heritage-gold",
  details: "Access comprehensive learning materials including vocabulary flashcards with native audio, sentence construction examples, traditional stories, and cultural content. Download materials for offline learning and share with your community.",
  link: "/learn",
  linkLabel: "Explore Resources"
}, {
  icon: Gamepad2,
  title: "Interactive Learning",
  description: "AI-powered pronunciation feedback, quizzes, mini-games, and progress tracking for all levels.",
  gradient: "from-heritage-gold to-accent",
  details: "Learn at your own pace with AI-powered pronunciation analysis that provides instant feedback. Test your knowledge with quizzes, practice through engaging mini-games, and track your progress from beginner to advanced levels.",
  link: "/learn",
  linkLabel: "Start Learning"
}, {
  icon: Shield,
  title: "Content Management",
  description: "Admin dashboard for managing languages, users, approving recordings, and organizing content.",
  gradient: "from-accent to-primary",
  details: "Our comprehensive admin dashboard allows linguists and moderators to manage languages, approve community recordings, organize content by difficulty level, and ensure quality across all learning materials.",
  link: "/admin",
  linkLabel: "View Dashboard"
}, {
  icon: Cloud,
  title: "Scalable Infrastructure",
  description: "High-fidelity audio capture, speech-to-text, and text-to-speech with cloud-based scalability.",
  gradient: "from-primary to-accent",
  details: "Built on enterprise-grade cloud infrastructure, our platform handles millions of audio recordings and AI processing requests. Automatic scaling ensures fast performance whether you're a single learner or an entire research institution.",
  link: "/about",
  linkLabel: "Learn More"
}];
const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setDialogOpen(true);
  };
  return <section className="py-24 md:py-32 relative overflow-hidden">
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
          return <button key={index} onClick={() => handleFeatureClick(feature)} className="group relative glass-card rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-500 animate-fade-in text-left cursor-pointer" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {/* Glow Effect on Hover */}
                
                
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

                {/* Click hint */}
                <span className="text-xs text-primary/60 mt-4 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to learn more →
                </span>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>;
        })}
        </div>
      </div>

      <FeatureDialog open={dialogOpen} onOpenChange={setDialogOpen} feature={selectedFeature} />
    </section>;
};
export default FeaturesSection;