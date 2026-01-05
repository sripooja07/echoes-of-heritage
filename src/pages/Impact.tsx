import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Users, Mic, BookOpen, Heart, Award, ArrowRight, TrendingUp } from "lucide-react";

const outcomes = [
  {
    icon: Globe,
    title: "Digital Language Archives",
    description: "Comprehensive digital preservation of endangered languages accessible to future generations worldwide.",
    stat: "150+",
    statLabel: "Languages Archived",
  },
  {
    icon: Mic,
    title: "AI Speech Synthesis",
    description: "Natural-sounding AI voices for endangered languages, enabling audio content creation and learning.",
    stat: "50+",
    statLabel: "Voice Models Created",
  },
  {
    icon: BookOpen,
    title: "Community Learning",
    description: "Interactive courses helping communities reconnect with their linguistic heritage.",
    stat: "500+",
    statLabel: "Learning Modules",
  },
  {
    icon: Users,
    title: "Empowered Communities",
    description: "Native speakers sharing their knowledge while learners gain access to cultural treasures.",
    stat: "10,000+",
    statLabel: "Active Members",
  },
];

const successStories = [
  {
    quote: "My grandchildren can now hear stories in our language that I thought would die with me.",
    author: "Mary Littlefeather",
    role: "Cherokee Elder",
    image: "👵",
  },
  {
    quote: "This platform helped me connect with my Māori roots. Te reo Māori is alive in my heart now.",
    author: "Tane Williams",
    role: "Māori Language Learner",
    image: "👨",
  },
  {
    quote: "As a linguist, I've never seen such a powerful tool for language preservation research.",
    author: "Dr. Elena Rodriguez",
    role: "University Researcher",
    image: "👩‍🔬",
  },
];

const Impact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 wave-pattern opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Measuring Our Impact</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Creating Lasting <span className="text-gradient">Change</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Every recording saved, every learner empowered, every voice preserved — 
                together we're building a future where no language is forgotten.
              </p>
            </div>
          </div>
        </section>

        {/* Outcomes Grid */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Outcomes</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
                Expected <span className="text-gradient">Impact</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {outcomes.map((outcome, index) => {
                const Icon = outcome.icon;
                return (
                  <div
                    key={index}
                    className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          {outcome.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{outcome.description}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-display font-bold text-gradient">{outcome.stat}</span>
                          <span className="text-sm text-muted-foreground">{outcome.statLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Success Stories</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
                Voices of <span className="text-gradient">Impact</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-8 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl mb-6">{story.image}</div>
                  <blockquote className="font-display text-lg text-foreground italic mb-6 leading-relaxed">
                    "{story.quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-foreground">{story.author}</p>
                    <p className="text-sm text-primary">{story.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">Our 2025 Goals</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { goal: "Archive 500+ languages", progress: 30 },
                    { goal: "Train 100+ AI voice models", progress: 50 },
                    { goal: "Reach 50,000 learners", progress: 16 },
                    { goal: "Partner with 200+ communities", progress: 40 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{item.goal}</span>
                        <span className="text-primary">{item.progress}%</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-0 wave-pattern opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-primary">Be Part of History</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Help Us <span className="text-gradient">Save More Languages</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10">
                Your contribution — whether as a native speaker, learner, or supporter — 
                directly impacts how many languages we can preserve for future generations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/join" className="gap-3">
                    Join the Movement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/record">Start Recording</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Impact;
