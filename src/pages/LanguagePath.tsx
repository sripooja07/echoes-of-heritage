import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Play, Lock, CheckCircle2, Star, 
  ArrowLeft, Trophy, Target, Clock, Volume2 
} from "lucide-react";

const languageData: Record<string, {
  name: string;
  image: string;
  description: string;
  levels: {
    id: string;
    name: string;
    description: string;
    lessons: {
      id: number;
      title: string;
      description: string;
      duration: string;
      completed: boolean;
      locked: boolean;
    }[];
  }[];
}> = {
  cherokee: {
    name: "Cherokee",
    image: "🏔️",
    description: "Learn the Cherokee language, spoken by the Cherokee people of the southeastern United States.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Master the basics of Cherokee including greetings, numbers, and essential vocabulary.",
        lessons: [
          { id: 1, title: "Cherokee Syllabary Introduction", description: "Learn the unique Cherokee writing system", duration: "15 min", completed: false, locked: false },
          { id: 2, title: "Basic Greetings", description: "Say hello, goodbye, and common phrases", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "Numbers 1-10", description: "Count in Cherokee", duration: "15 min", completed: false, locked: false },
          { id: 4, title: "Family Members", description: "Learn words for family relationships", duration: "25 min", completed: false, locked: false },
          { id: 5, title: "Colors & Nature", description: "Describe the world around you", duration: "20 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Build sentences, learn verb conjugations, and expand your vocabulary.",
        lessons: [
          { id: 6, title: "Simple Sentences", description: "Construct basic Cherokee sentences", duration: "30 min", completed: false, locked: false },
          { id: 7, title: "Verb Basics", description: "Understand Cherokee verb structure", duration: "35 min", completed: false, locked: false },
          { id: 8, title: "Daily Activities", description: "Talk about everyday actions", duration: "25 min", completed: false, locked: false },
          { id: 9, title: "Food & Eating", description: "Vocabulary for meals and cuisine", duration: "25 min", completed: false, locked: false },
          { id: 10, title: "Asking Questions", description: "Form questions in Cherokee", duration: "30 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Master complex grammar, cultural expressions, and conversational fluency.",
        lessons: [
          { id: 11, title: "Complex Sentences", description: "Advanced sentence structures", duration: "40 min", completed: false, locked: false },
          { id: 12, title: "Storytelling", description: "Traditional Cherokee narratives", duration: "45 min", completed: false, locked: false },
          { id: 13, title: "Cultural Ceremonies", description: "Language of Cherokee traditions", duration: "35 min", completed: false, locked: false },
          { id: 14, title: "Conversational Practice", description: "Real-world dialogue scenarios", duration: "50 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your Cherokee knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Cherokee skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
  maori: {
    name: "Māori",
    image: "🌊",
    description: "Discover Te Reo Māori, the indigenous language of New Zealand's Māori people.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Start your journey with basic Māori greetings, pronunciation, and essential phrases.",
        lessons: [
          { id: 1, title: "Pronunciation Guide", description: "Master Māori vowels and consonants", duration: "15 min", completed: false, locked: false },
          { id: 2, title: "Greetings & Farewells", description: "Kia ora, Haere mai, and more", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "Introducing Yourself", description: "Ko wai koe? Learn to introduce yourself", duration: "25 min", completed: false, locked: false },
          { id: 4, title: "Numbers & Counting", description: "Count from 1 to 100", duration: "20 min", completed: false, locked: false },
          { id: 5, title: "Family & Relationships", description: "Whānau vocabulary", duration: "25 min", completed: false, locked: false },
          { id: 6, title: "Colors & Descriptions", description: "Describe things around you", duration: "20 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Build fluency with sentence structures, everyday conversations, and cultural context.",
        lessons: [
          { id: 7, title: "Sentence Structure", description: "Te reo sentence patterns", duration: "30 min", completed: false, locked: false },
          { id: 8, title: "Actions & Verbs", description: "Express actions in Māori", duration: "35 min", completed: false, locked: false },
          { id: 9, title: "Time & Place", description: "When and where expressions", duration: "25 min", completed: false, locked: false },
          { id: 10, title: "Marae Protocol", description: "Language of the meeting house", duration: "40 min", completed: false, locked: false },
          { id: 11, title: "Food & Dining", description: "Kai vocabulary and customs", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Achieve fluency through complex grammar, whakataukī (proverbs), and cultural immersion.",
        lessons: [
          { id: 12, title: "Complex Grammar", description: "Passive voice and advanced structures", duration: "45 min", completed: false, locked: false },
          { id: 13, title: "Whakataukī (Proverbs)", description: "Traditional Māori wisdom", duration: "35 min", completed: false, locked: false },
          { id: 14, title: "Waiata (Songs)", description: "Learn through traditional songs", duration: "40 min", completed: false, locked: false },
          { id: 15, title: "Pūrākau (Legends)", description: "Traditional Māori stories", duration: "50 min", completed: false, locked: false },
          { id: 16, title: "Conversational Fluency", description: "Real-world dialogue mastery", duration: "60 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your Te Reo Māori knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Māori skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
  navajo: {
    name: "Navajo",
    image: "🏜️",
    description: "Learn Diné Bizaad, the language of the Navajo Nation, the largest Native American tribe.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Begin with Navajo sounds, greetings, and foundational vocabulary.",
        lessons: [
          { id: 1, title: "Navajo Sounds", description: "Unique consonants and tones", duration: "20 min", completed: false, locked: false },
          { id: 2, title: "Yá'át'ééh - Greetings", description: "Daily greetings and responses", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "Clan Introduction", description: "Introducing your clans", duration: "25 min", completed: false, locked: false },
          { id: 4, title: "Numbers & Counting", description: "Navajo number system", duration: "20 min", completed: false, locked: false },
          { id: 5, title: "Nature Words", description: "Land, sky, and animals", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Develop conversational skills with verbs, sentences, and cultural expressions.",
        lessons: [
          { id: 6, title: "Verb Conjugation", description: "Complex Navajo verb system", duration: "40 min", completed: false, locked: false },
          { id: 7, title: "Daily Routines", description: "Describe your day", duration: "30 min", completed: false, locked: false },
          { id: 8, title: "Directions & Places", description: "Navigate in Navajo", duration: "25 min", completed: false, locked: false },
          { id: 9, title: "Weather & Seasons", description: "Describe the environment", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Master the complex verb system and engage with Navajo cultural traditions.",
        lessons: [
          { id: 10, title: "Advanced Verbs", description: "Aspect and mode mastery", duration: "50 min", completed: false, locked: false },
          { id: 11, title: "Traditional Stories", description: "Navajo oral traditions", duration: "45 min", completed: false, locked: false },
          { id: 12, title: "Ceremonial Language", description: "Respectful cultural expressions", duration: "40 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your Diné Bizaad knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Navajo skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
  welsh: {
    name: "Welsh",
    image: "🏰",
    description: "Learn Cymraeg, the Celtic language of Wales with a rich literary tradition.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Start with Welsh pronunciation, greetings, and everyday phrases.",
        lessons: [
          { id: 1, title: "Welsh Alphabet", description: "Unique letters and pronunciation", duration: "15 min", completed: false, locked: false },
          { id: 2, title: "Greetings & Introductions", description: "Shwmae! Basic interactions", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "Numbers & Time", description: "Count and tell time", duration: "25 min", completed: false, locked: false },
          { id: 4, title: "Family & Home", description: "Household vocabulary", duration: "20 min", completed: false, locked: false },
          { id: 5, title: "Colors & Objects", description: "Describe everyday items", duration: "20 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Build confidence with mutations, sentences, and conversational Welsh.",
        lessons: [
          { id: 6, title: "Mutations Explained", description: "Soft, nasal, and aspirate", duration: "35 min", completed: false, locked: false },
          { id: 7, title: "Present Tense", description: "Describe current actions", duration: "30 min", completed: false, locked: false },
          { id: 8, title: "Past & Future", description: "Talk about time", duration: "35 min", completed: false, locked: false },
          { id: 9, title: "Shopping & Services", description: "Practical Welsh", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Achieve fluency through literature, poetry, and cultural immersion.",
        lessons: [
          { id: 10, title: "Literary Welsh", description: "Reading Welsh literature", duration: "45 min", completed: false, locked: false },
          { id: 11, title: "Welsh Poetry", description: "Cynghanedd and traditions", duration: "40 min", completed: false, locked: false },
          { id: 12, title: "Conversational Mastery", description: "Fluent dialogue practice", duration: "50 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your Cymraeg knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Welsh skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
  hawaiian: {
    name: "Hawaiian",
    image: "🌺",
    description: "Learn ʻŌlelo Hawaiʻi, the indigenous language of the Hawaiian Islands.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Begin with Hawaiian sounds, aloha spirit, and essential vocabulary.",
        lessons: [
          { id: 1, title: "Hawaiian Sounds", description: "Vowels, consonants, and 'okina", duration: "15 min", completed: false, locked: false },
          { id: 2, title: "Aloha & Greetings", description: "The spirit of aloha", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "ʻOhana (Family)", description: "Family relationships", duration: "25 min", completed: false, locked: false },
          { id: 4, title: "Numbers & Counting", description: "Hawaiian numerals", duration: "20 min", completed: false, locked: false },
          { id: 5, title: "Nature & Environment", description: "Land and sea vocabulary", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Develop skills with sentence patterns, directions, and cultural vocabulary.",
        lessons: [
          { id: 6, title: "Sentence Patterns", description: "Hawaiian sentence structure", duration: "30 min", completed: false, locked: false },
          { id: 7, title: "Directions & Places", description: "Navigate the islands", duration: "25 min", completed: false, locked: false },
          { id: 8, title: "Food & Traditions", description: "Cuisine and customs", duration: "30 min", completed: false, locked: false },
          { id: 9, title: "Daily Conversations", description: "Everyday interactions", duration: "35 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Master Hawaiian through mele (songs), moʻolelo (stories), and cultural depth.",
        lessons: [
          { id: 10, title: "Mele (Songs)", description: "Learn through Hawaiian music", duration: "40 min", completed: false, locked: false },
          { id: 11, title: "Moʻolelo (Stories)", description: "Traditional Hawaiian legends", duration: "45 min", completed: false, locked: false },
          { id: 12, title: "Cultural Fluency", description: "Deep cultural understanding", duration: "50 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your ʻŌlelo Hawaiʻi knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Hawaiian skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
  basque: {
    name: "Basque",
    image: "⛰️",
    description: "Discover Euskara, one of Europe's oldest languages with no known relatives.",
    levels: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Start with Basque pronunciation, greetings, and unique grammar concepts.",
        lessons: [
          { id: 1, title: "Basque Sounds", description: "Pronunciation and alphabet", duration: "15 min", completed: false, locked: false },
          { id: 2, title: "Kaixo! Greetings", description: "Basic greetings and farewells", duration: "20 min", completed: false, locked: false },
          { id: 3, title: "Numbers & Time", description: "Counting in Basque", duration: "25 min", completed: false, locked: false },
          { id: 4, title: "Introductions", description: "Introduce yourself", duration: "20 min", completed: false, locked: false },
          { id: 5, title: "Basic Vocabulary", description: "Essential everyday words", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Learn the ergative case system and build conversational skills.",
        lessons: [
          { id: 6, title: "Ergative Case", description: "Unique Basque grammar", duration: "40 min", completed: false, locked: false },
          { id: 7, title: "Verb System", description: "Auxiliary verbs and conjugation", duration: "45 min", completed: false, locked: false },
          { id: 8, title: "Daily Life", description: "Describe routines", duration: "30 min", completed: false, locked: false },
          { id: 9, title: "Food & Culture", description: "Basque cuisine vocabulary", duration: "25 min", completed: false, locked: false },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Master complex grammar and engage with Basque literature and traditions.",
        lessons: [
          { id: 10, title: "Complex Sentences", description: "Advanced structures", duration: "50 min", completed: false, locked: false },
          { id: 11, title: "Bertsolaritza", description: "Improvised verse tradition", duration: "45 min", completed: false, locked: false },
          { id: 12, title: "Literary Basque", description: "Reading and writing", duration: "55 min", completed: false, locked: false },
        ],
      },
      {
        id: "practice-test",
        name: "Final Practice Test",
        description: "Test your Euskara knowledge with a comprehensive exam covering all levels.",
        lessons: [
          { id: 100, title: "Comprehensive Practice Test", description: "Complete assessment of all Basque skills", duration: "60 min", completed: false, locked: false },
        ],
      },
    ],
  },
};

const getLevelIcon = (levelId: string) => {
  switch (levelId) {
    case "beginner":
      return <Target className="w-5 h-5" />;
    case "intermediate":
      return <Star className="w-5 h-5" />;
    case "advanced":
      return <Trophy className="w-5 h-5" />;
    case "practice-test":
      return <Trophy className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

const getLevelColor = (levelId: string) => {
  switch (levelId) {
    case "beginner":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "intermediate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "advanced":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "practice-test":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const LanguagePath = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const [expandedLevel, setExpandedLevel] = useState<string>("beginner");
  
  const language = languageId ? languageData[languageId] : null;

  if (!language) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-24">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-bold mb-4">Language Not Found</h1>
            <p className="text-muted-foreground mb-8">This language course is not yet available.</p>
            <Button asChild>
              <Link to="/learn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Languages
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalLessons = language.levels.reduce((acc, level) => acc + level.lessons.length, 0);
  const completedLessons = language.levels.reduce(
    (acc, level) => acc + level.lessons.filter((l) => l.completed).length,
    0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 wave-pattern opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/learn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Languages
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="text-8xl">{language.image}</div>
              <div className="flex-1">
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Learn <span className="text-gradient">{language.name}</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  {language.description}
                </p>

                {/* Progress Overview */}
                <div className="glass-card rounded-xl p-6 max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons} / {totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-3 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {progressPercent === 0
                      ? "Start your learning journey today!"
                      : `${progressPercent}% complete - keep going!`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {language.levels.map((level, levelIndex) => {
                const levelCompleted = level.lessons.filter((l) => l.completed).length;
                const levelProgress = Math.round((levelCompleted / level.lessons.length) * 100);
                const isExpanded = expandedLevel === level.id;
                const previousLevelComplete =
                  levelIndex === 0 ||
                  language.levels[levelIndex - 1].lessons.every((l) => l.completed) ||
                  level.lessons.some((l) => !l.locked);

                return (
                  <div key={level.id} className="glass-card rounded-2xl overflow-hidden">
                    {/* Level Header */}
                    <button
                      onClick={() => setExpandedLevel(isExpanded ? "" : level.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${getLevelColor(
                            level.id
                          )}`}
                        >
                          {getLevelIcon(level.id)}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-xl font-semibold">{level.name}</h3>
                            <Badge variant="outline" className={getLevelColor(level.id)}>
                              {level.lessons.length} lessons
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-medium">{levelProgress}%</div>
                          <Progress value={levelProgress} className="w-24 h-2" />
                        </div>
                        <div
                          className={`transform transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </div>
                      </div>
                    </button>

                    {/* Lessons List */}
                    {isExpanded && (
                      <div className="border-t border-border px-6 pb-6">
                        <div className="space-y-3 pt-4">
                          {level.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                                lesson.locked
                                  ? "bg-muted/30 opacity-60"
                                  : lesson.completed
                                  ? "bg-green-500/10 border border-green-500/30"
                                  : "bg-secondary/50 hover:bg-secondary"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                  lesson.completed
                                    ? "bg-green-500 text-white"
                                    : lesson.locked
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : lesson.locked ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <span className="font-semibold text-sm">{lesson.id}</span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{lesson.title}</h4>
                                <p className="text-sm text-muted-foreground truncate">
                                  {lesson.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {lesson.duration}
                                </div>
                                <Button
                                  size="sm"
                                  variant={lesson.locked ? "ghost" : "default"}
                                  disabled={lesson.locked}
                                  asChild={!lesson.locked}
                                >
                                  {lesson.locked ? (
                                    <span>
                                      <Lock className="w-4 h-4" />
                                    </span>
                                  ) : (
                                    <Link to={lesson.id === 100 ? `/learn/${languageId}/practice-test` : `/learn/${languageId}/lesson/${lesson.id}`}>
                                      {lesson.completed ? "Review" : lesson.id === 100 ? "Take Test" : "Start"}
                                      <Play className="w-4 h-4 ml-1" />
                                    </Link>
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 md:py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
                Tips for <span className="text-gradient">Successful Learning</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Volume2 className="w-8 h-8" />,
                    title: "Practice Pronunciation",
                    description: "Use our AI voice tools to perfect your accent",
                  },
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "Daily Practice",
                    description: "Just 15 minutes a day builds lasting fluency",
                  },
                  {
                    icon: <BookOpen className="w-8 h-8" />,
                    title: "Cultural Context",
                    description: "Understanding culture deepens language learning",
                  },
                ].map((tip, i) => (
                  <div key={i} className="glass-card rounded-xl p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                      {tip.icon}
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
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

export default LanguagePath;
