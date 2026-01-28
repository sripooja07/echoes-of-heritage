import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Globe, Loader2, ChevronLeft } from "lucide-react";
import LessonCard from "@/components/lessons/LessonCard";

interface Language {
  id: string;
  name: string;
  native_name: string | null;
  code: string;
  description: string | null;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  example_sentences: string[];
  difficulty: string;
  order_index: number;
}

const getLanguageEmoji = (code: string) => {
  const emojis: Record<string, string> = {
    en: "🇬🇧",
    hi: "🇮🇳",
    te: "🏛️",
  };
  return emojis[code] || "🌍";
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "intermediate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "advanced":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Learn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  // Fetch languages
  const { data: languages, isLoading: loadingLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Language[];
    },
  });

  // Fetch lessons for selected language
  const { data: lessons, isLoading: loadingLessons } = useQuery({
    queryKey: ["lessons", selectedLanguage?.id],
    queryFn: async () => {
      if (!selectedLanguage) return [];
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("language_id", selectedLanguage.id)
        .order("order_index");
      if (error) throw error;
      return data.map((lesson) => ({
        ...lesson,
        example_sentences: (lesson.example_sentences as string[]) || [],
      })) as Lesson[];
    },
    enabled: !!selectedLanguage,
  });

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
                {selectedLanguage ? (
                  <>
                    Learn <span className="text-gradient">{selectedLanguage.name}</span>
                  </>
                ) : (
                  <>
                    Choose Your <span className="text-gradient">Language</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground">
                {selectedLanguage
                  ? selectedLanguage.description
                  : "Select a language to start your learning journey with interactive lessons and examples."}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {!selectedLanguage ? (
              // Language Selection
              <>
                {loadingLanguages ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {languages?.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang)}
                        className="group glass-card rounded-2xl p-8 text-left hover:border-primary/30 transition-all duration-500 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl">{getLanguageEmoji(lang.code)}</span>
                          <div>
                            <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {lang.name}
                            </h3>
                            {lang.native_name && (
                              <p className="text-lg text-muted-foreground">{lang.native_name}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{lang.description}</p>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <span>Start Learning</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {languages?.length === 0 && !loadingLanguages && (
                  <div className="text-center py-16">
                    <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No languages available</h3>
                    <p className="text-muted-foreground">Check back soon for new languages!</p>
                  </div>
                )}
              </>
            ) : (
              // Lessons for Selected Language
              <>
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedLanguage(null)}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Languages
                  </Button>
                </div>

                {loadingLessons ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons?.map((lesson, index) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        languageEmoji={getLanguageEmoji(selectedLanguage.code)}
                        index={index}
                        getDifficultyColor={getDifficultyColor}
                      />
                    ))}
                  </div>
                )}

                {lessons?.length === 0 && !loadingLessons && (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No lessons yet</h3>
                    <p className="text-muted-foreground">Lessons for this language are coming soon!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Learn;
