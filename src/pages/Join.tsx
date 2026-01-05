import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Users, Mic, BookOpen, Globe, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const roles = [
  {
    id: "contributor",
    name: "Contributor",
    icon: Mic,
    description: "I'm a native speaker who wants to record my language",
  },
  {
    id: "learner",
    name: "Learner",
    icon: BookOpen,
    description: "I want to learn an endangered language",
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: Globe,
    description: "I'm a linguist or researcher studying languages",
  },
  {
    id: "supporter",
    name: "Supporter",
    icon: Heart,
    description: "I want to support the mission financially or otherwise",
  },
];

const Join = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Welcome to the movement!",
      description: "We'll be in touch soon with next steps.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              You're <span className="text-gradient">In!</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for joining our mission to preserve endangered languages. 
              Check your email for next steps.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 wave-pattern opacity-20" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-primary">Join the Movement</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
                Be Part of Something <span className="text-gradient">Meaningful</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Whether you're a native speaker, a language enthusiast, or simply someone who 
                cares about cultural heritage, your contribution matters.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Role Selection */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="font-display text-xl font-semibold mb-6">How would you like to contribute?</h2>
                  
                  <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <div key={role.id}>
                          <RadioGroupItem
                            value={role.id}
                            id={role.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={role.id}
                            className="flex flex-col items-center p-6 rounded-xl border-2 border-border cursor-pointer transition-all duration-300 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground mb-1">{role.name}</span>
                            <span className="text-sm text-muted-foreground text-center">
                              {role.description}
                            </span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Contact Information */}
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <h2 className="font-display text-xl font-semibold">Your Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {(selectedRole === "contributor" || selectedRole === "learner") && (
                    <div className="space-y-2">
                      <Label htmlFor="language">
                        {selectedRole === "contributor" 
                          ? "What language do you speak?" 
                          : "What language do you want to learn?"}
                      </Label>
                      <Input
                        id="language"
                        placeholder="e.g., Cherokee, Māori, Navajo"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us more (optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your story or motivation..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full gap-2"
                  disabled={!selectedRole || isSubmitting}
                >
                  {isSubmitting ? (
                    "Joining..."
                  ) : (
                    <>
                      Join the Movement
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-12">
                Join <span className="text-gradient">10,000+ Members</span> Already Making an Impact
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Native Speakers", value: "2,500+" },
                  { label: "Learners", value: "6,800+" },
                  { label: "Researchers", value: "450+" },
                  { label: "Countries", value: "85" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Join;
