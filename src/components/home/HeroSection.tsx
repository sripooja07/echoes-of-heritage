import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic, Play, ArrowRight, Sparkles, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user, isAdmin, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 wave-pattern opacity-30" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Language Learning & Preservation</span>
          </div>

          {/* App Name */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">LinguaPreserve</span>
          </h1>

          {/* Tagline */}
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Learn and preserve languages, one lesson at a time.
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            LinguaPreserve helps you learn and preserve endangered languages through interactive lessons, authentic audio recordings, and engaging quizzes. Start your language journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/learn" className="gap-3">
                <Play className="w-5 h-5" />
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/record" className="gap-3">
                <Mic className="w-5 h-5" />
                Contribute Your Voice
              </Link>
            </Button>
          </div>

          {/* Auth & Role Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            {!loading && !user && (
              <Button variant="glow" size="lg" asChild>
                <Link to="/auth" className="gap-2">
                  <User className="w-5 h-5" />
                  Sign Up / Login
                </Link>
              </Button>
            )}
            {!loading && user && (
              <>
                {isAdmin && (
                  <Button variant="glow" size="lg" asChild>
                    <Link to="/admin" className="gap-2">
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="glass" size="lg" asChild>
                  <Link to="/profile" className="gap-2">
                    <User className="w-5 h-5" />
                    My Profile
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: "📚", title: "Interactive Lessons", description: "Step-by-step learning paths" },
              { icon: "🎧", title: "Authentic Audio", description: "Native speaker recordings" },
              { icon: "✨", title: "Fun Quizzes", description: "Test your knowledge" },
            ].map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
