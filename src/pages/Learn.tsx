import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Volume2, Search, Star, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const languages = [
  {
    id: "cherokee",
    name: "Cherokee",
    region: "North America",
    speakers: "2,000",
    status: "Critically Endangered",
    lessons: 24,
    learners: 1250,
    image: "🏔️",
    difficulty: "Intermediate",
    progress: 0,
  },
  {
    id: "maori",
    name: "Māori",
    region: "Oceania",
    speakers: "50,000",
    status: "Endangered",
    lessons: 36,
    learners: 3400,
    image: "🌊",
    difficulty: "Beginner",
    progress: 0,
  },
  {
    id: "navajo",
    name: "Navajo",
    region: "North America",
    speakers: "170,000",
    status: "Vulnerable",
    lessons: 42,
    learners: 5600,
    image: "🏜️",
    difficulty: "Beginner",
    progress: 0,
  },
  {
    id: "welsh",
    name: "Welsh",
    region: "Europe",
    speakers: "750,000",
    status: "Recovering",
    lessons: 48,
    learners: 8900,
    image: "🏰",
    difficulty: "Beginner",
    progress: 0,
  },
  {
    id: "hawaiian",
    name: "Hawaiian",
    region: "Oceania",
    speakers: "24,000",
    status: "Critically Endangered",
    lessons: 28,
    learners: 2100,
    image: "🌺",
    difficulty: "Beginner",
    progress: 0,
  },
  {
    id: "basque",
    name: "Basque",
    region: "Europe",
    speakers: "750,000",
    status: "Vulnerable",
    lessons: 38,
    learners: 4200,
    image: "⛰️",
    difficulty: "Advanced",
    progress: 0,
  },
  // Asian Languages
  {
    id: "ainu",
    name: "Ainu",
    region: "Asia",
    speakers: "10",
    status: "Critically Endangered",
    lessons: 20,
    learners: 890,
    image: "🗾",
    difficulty: "Advanced",
    progress: 0,
  },
  {
    id: "tibetan",
    name: "Tibetan",
    region: "Asia",
    speakers: "1,200,000",
    status: "Vulnerable",
    lessons: 45,
    learners: 6200,
    image: "🏔️",
    difficulty: "Advanced",
    progress: 0,
  },
  {
    id: "odia",
    name: "Odia",
    region: "Asia",
    speakers: "35,000,000",
    status: "Vulnerable",
    lessons: 40,
    learners: 4800,
    image: "🛕",
    difficulty: "Intermediate",
    progress: 0,
  },
  {
    id: "buryat",
    name: "Buryat",
    region: "Asia",
    speakers: "265,000",
    status: "Endangered",
    lessons: 28,
    learners: 1100,
    image: "🐎",
    difficulty: "Intermediate",
    progress: 0,
  },
  {
    id: "khmer",
    name: "Khmer",
    region: "Asia",
    speakers: "16,000,000",
    status: "Vulnerable",
    lessons: 42,
    learners: 5400,
    image: "🛕",
    difficulty: "Intermediate",
    progress: 0,
  },
  {
    id: "dzongkha",
    name: "Dzongkha",
    region: "Asia",
    speakers: "640,000",
    status: "Vulnerable",
    lessons: 32,
    learners: 980,
    image: "🏯",
    difficulty: "Advanced",
    progress: 0,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Critically Endangered":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "Endangered":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Vulnerable":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Recovering":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const filteredLanguages = languages.filter((lang) => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || lang.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ["all", ...new Set(languages.map((l) => l.region))];

  const playPronunciation = (word: string, native: string) => {
    if (playingWord === native) {
      window.speechSynthesis.cancel();
      setPlayingWord(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setPlayingWord(native);
    };
    
    utterance.onend = () => {
      setPlayingWord(null);
    };
    
    utterance.onerror = () => {
      setPlayingWord(null);
      toast({
        title: "Playback error",
        description: "Could not play pronunciation.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 wave-pattern opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Interactive Learning</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
                Learn an <span className="text-gradient">Endangered Language</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore interactive courses with AI-powered pronunciation feedback, 
                vocabulary lessons, and cultural content from native speakers.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search languages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {regions.map((region) => (
                      <Button
                        key={region}
                        variant={selectedRegion === region ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRegion(region)}
                      >
                        {region === "all" ? "All Regions" : region}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Language Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500"
                >
                  {/* Header */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl">{lang.image}</span>
                    <Badge
                      className={`absolute top-4 right-4 ${getStatusColor(lang.status)}`}
                      variant="outline"
                    >
                      {lang.status}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {lang.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{lang.region}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-semibold">{lang.lessons}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">Lessons</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{lang.learners}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">Learners</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Star className="w-4 h-4" />
                          <span className="font-semibold">{lang.difficulty}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">Level</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{lang.progress}%</span>
                      </div>
                      <Progress value={lang.progress} className="h-2" />
                    </div>

                    {/* Native Speakers */}
                    <p className="text-xs text-muted-foreground">
                      ~{lang.speakers} native speakers remaining
                    </p>

                    {/* CTA */}
                    <Button variant="hero" className="w-full gap-2" asChild>
                      <Link to={`/learn/${lang.id}`}>
                        Start Learning
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No languages found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Lesson Preview */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Featured</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
                  Sample <span className="text-gradient">Lesson Preview</span>
                </h2>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">🌊</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">Māori - Lesson 1</h3>
                    <p className="text-muted-foreground">Basic Greetings</p>
                  </div>
                </div>

                {/* Vocabulary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    { native: "Kia ora", translation: "Hello", phonetic: "kee-ah or-ah" },
                    { native: "Tēnā koe", translation: "Hello (formal)", phonetic: "teh-nah koy" },
                    { native: "Haere mai", translation: "Welcome", phonetic: "ha-eh-reh my" },
                    { native: "Ka kite", translation: "See you later", phonetic: "kah kee-teh" },
                  ].map((word, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{word.native}</p>
                        <p className="text-sm text-muted-foreground">{word.translation}</p>
                        <p className="text-xs text-primary">/{word.phonetic}/</p>
                      </div>
                      <Button 
                        variant={playingWord === word.native ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => playPronunciation(word.native, word.native)}
                        className="shrink-0"
                      >
                        <Volume2 className={`w-5 h-5 ${playingWord === word.native ? "animate-pulse" : ""}`} />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="hero" size="lg" className="w-full gap-2" asChild>
                  <Link to="/learn/maori/lesson/2">
                    <Play className="w-5 h-5" />
                    Start This Lesson
                  </Link>
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

export default Learn;
