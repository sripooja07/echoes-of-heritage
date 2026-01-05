import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mic, BookOpen } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 wave-pattern opacity-20" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Join the Movement</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Every Voice Matters.{" "}
            <span className="text-gradient">Make Yours Count.</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Whether you're a native speaker, a learner, or a researcher — your contribution helps preserve endangered languages for future generations.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/record" className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Record</h3>
              <p className="text-sm text-muted-foreground">Share your native language</p>
            </Link>

            <Link to="/learn" className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Learn</h3>
              <p className="text-sm text-muted-foreground">Explore endangered languages</p>
            </Link>

            <Link to="/join" className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-heritage-gold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">Help fund our mission</p>
            </Link>
          </div>

          {/* Main CTA */}
          <Button variant="hero" size="xl" asChild>
            <Link to="/join" className="gap-3">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
