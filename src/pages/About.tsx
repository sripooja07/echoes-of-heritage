import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Globe, Users, TrendingDown, ArrowRight } from "lucide-react";

const problemStats = [
  {
    icon: Globe,
    stat: "7,000+",
    label: "Languages Spoken Today",
    detail: "But this number shrinks every year",
  },
  {
    icon: AlertTriangle,
    stat: "43%",
    label: "Are Endangered",
    detail: "Nearly half of all languages face extinction",
  },
  {
    icon: TrendingDown,
    stat: "1 Language",
    label: "Dies Every 2 Weeks",
    detail: "Taking irreplaceable knowledge with it",
  },
  {
    icon: Users,
    stat: "Only 23",
    label: "Languages Dominant",
    detail: "Used by over half the world's population",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 wave-pattern opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">The Crisis</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Languages Are <span className="text-gradient">Disappearing</span> Faster Than Ever
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Every two weeks, a language dies — taking with it centuries of cultural knowledge, 
                unique worldviews, and irreplaceable wisdom. This is a crisis that affects all of humanity.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {problemStats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
                      {item.stat}
                    </div>
                    <div className="font-semibold text-foreground mb-2">{item.label}</div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
                Why <span className="text-gradient">Language Loss</span> Matters
              </h2>

              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Cultural Heritage Lost</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Each language carries unique stories, songs, and traditions that cannot be translated. 
                    When a language dies, centuries of oral history, medicinal knowledge, and cultural 
                    practices disappear forever.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Scientific Knowledge Vanishes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Indigenous languages often contain detailed knowledge about local ecosystems, 
                    medicinal plants, and sustainable practices developed over thousands of years. 
                    This knowledge is invaluable for modern science.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Identity & Community Fracture</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Language is the foundation of cultural identity. When communities lose their 
                    native tongue, younger generations become disconnected from their heritage, 
                    leading to cultural erosion and loss of identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Solution</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                Technology Can <span className="text-gradient">Save Languages</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                By combining AI voice synthesis, digital archiving, and interactive learning tools, 
                we can preserve endangered languages and help communities reconnect with their heritage.
              </p>

              <Button variant="hero" size="xl" asChild>
                <Link to="/join" className="gap-3">
                  Join the Movement
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
