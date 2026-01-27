import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Brain, Mic, Trophy } from "lucide-react";

const Practice = () => {
  const practiceTypes = [
    {
      icon: Brain,
      title: "Vocabulary Quiz",
      description: "Test your word knowledge with flashcards and multiple choice questions.",
      link: "/learn",
      color: "from-primary to-accent",
    },
    {
      icon: Mic,
      title: "Pronunciation",
      description: "Practice speaking and compare your pronunciation with native speakers.",
      link: "/record",
      color: "from-accent to-primary",
    },
    {
      icon: Trophy,
      title: "Daily Challenge",
      description: "Complete daily challenges to maintain your learning streak.",
      link: "/learn",
      color: "from-primary to-heritage-gold",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Practice Mode</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Practice</span> Makes Perfect
            </h1>
            <p className="text-lg text-muted-foreground">
              Reinforce your learning with interactive quizzes, pronunciation exercises, and daily challenges.
            </p>
          </div>

          {/* Practice Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {practiceTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Link
                  key={index}
                  to={type.link}
                  className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/learn" className="gap-2">
                Start a Lesson First
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Practice;
