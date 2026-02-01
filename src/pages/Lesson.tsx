import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, ArrowRight, Volume2, CheckCircle2, 
  XCircle, BookOpen, RotateCcw, Home
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface VocabularyItem {
  word: string;
  translation: string;
  phonetic: string;
  example?: string;
}

interface LessonContent {
  title: string;
  language: string;
  languageId: string;
  description: string;
  vocabulary: VocabularyItem[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

const lessonData: Record<string, Record<number, LessonContent>> = {
  maori: {
    1: {
      title: "Pronunciation Guide",
      language: "Māori",
      languageId: "maori",
      description: "Master the sounds of Te Reo Māori. The vowels and consonants have consistent pronunciation.",
      vocabulary: [
        { word: "A", translation: "as in 'car'", phonetic: "ah" },
        { word: "E", translation: "as in 'bed'", phonetic: "eh" },
        { word: "I", translation: "as in 'bee'", phonetic: "ee" },
        { word: "O", translation: "as in 'or'", phonetic: "oh" },
        { word: "U", translation: "as in 'soon'", phonetic: "oo" },
        { word: "Wh", translation: "soft 'f' sound", phonetic: "f" },
        { word: "Ng", translation: "as in 'singer'", phonetic: "ng" },
      ],
      quiz: [
        { question: "How is 'A' pronounced in Māori?", options: ["like 'cat'", "like 'car'", "like 'cape'", "like 'call'"], correct: 1 },
        { question: "What sound does 'Wh' make?", options: ["w sound", "h sound", "f sound", "sh sound"], correct: 2 },
        { question: "How is 'E' pronounced?", options: ["like 'bee'", "like 'bed'", "like 'bay'", "silent"], correct: 1 },
      ],
    },
    2: {
      title: "Greetings & Farewells",
      language: "Māori",
      languageId: "maori",
      description: "Learn essential greetings and farewells in Te Reo Māori.",
      vocabulary: [
        { word: "Kia ora", translation: "Hello / Thank you", phonetic: "kee-ah or-ah", example: "Kia ora, e hoa!" },
        { word: "Tēnā koe", translation: "Hello (to one person)", phonetic: "teh-nah koy", example: "Tēnā koe, how are you?" },
        { word: "Tēnā kōrua", translation: "Hello (to two people)", phonetic: "teh-nah koh-roo-ah" },
        { word: "Tēnā koutou", translation: "Hello (to many)", phonetic: "teh-nah koh-toh" },
        { word: "Haere mai", translation: "Welcome / Come here", phonetic: "ha-eh-reh my" },
        { word: "Haere rā", translation: "Goodbye (to one leaving)", phonetic: "ha-eh-reh rah" },
        { word: "E noho rā", translation: "Goodbye (to one staying)", phonetic: "eh noh-hoh rah" },
        { word: "Ka kite", translation: "See you later", phonetic: "kah kee-teh" },
      ],
      quiz: [
        { question: "What does 'Kia ora' mean?", options: ["Goodbye", "Hello / Thank you", "Welcome", "Sorry"], correct: 1 },
        { question: "Which greeting is for two people?", options: ["Tēnā koe", "Tēnā kōrua", "Tēnā koutou", "Kia ora"], correct: 1 },
        { question: "What does 'Ka kite' mean?", options: ["Hello", "Welcome", "See you later", "Thank you"], correct: 2 },
        { question: "Which means 'Welcome'?", options: ["Haere rā", "Haere mai", "E noho rā", "Ka kite"], correct: 1 },
      ],
    },
  },
  cherokee: {
    1: {
      title: "Cherokee Syllabary Introduction",
      language: "Cherokee",
      languageId: "cherokee",
      description: "Discover the unique Cherokee syllabary created by Sequoyah in the 1820s.",
      vocabulary: [
        { word: "Ꭰ", translation: "a (as in father)", phonetic: "a" },
        { word: "Ꭱ", translation: "e (as in way)", phonetic: "e" },
        { word: "Ꭲ", translation: "i (as in police)", phonetic: "i" },
        { word: "Ꭳ", translation: "o (as in note)", phonetic: "o" },
        { word: "Ꭴ", translation: "u (as in fool)", phonetic: "u" },
        { word: "Ꭵ", translation: "v (nasalized)", phonetic: "v" },
      ],
      quiz: [
        { question: "Who created the Cherokee syllabary?", options: ["Cherokee Nation", "Sequoyah", "European missionaries", "Unknown"], correct: 1 },
        { question: "How many vowel sounds are in Cherokee?", options: ["5", "6", "7", "4"], correct: 1 },
        { question: "What is Ꭰ?", options: ["e sound", "a sound", "i sound", "o sound"], correct: 1 },
      ],
    },
    2: {
      title: "Basic Greetings",
      language: "Cherokee",
      languageId: "cherokee",
      description: "Learn essential Cherokee greetings and phrases.",
      vocabulary: [
        { word: "ᎣᏏᏲ", translation: "Hello", phonetic: "o-si-yo" },
        { word: "ᏙᎾᏓᎪᎲᎢ", translation: "How are you?", phonetic: "do-na-da-go-hv-i" },
        { word: "ᎣᏍᏓ", translation: "I am well", phonetic: "o-s-da" },
        { word: "ᏙᎾᏓᎪᎲ", translation: "Until we meet again", phonetic: "do-na-da-go-hv" },
        { word: "ᏩᏙᏗᎢ", translation: "Thank you", phonetic: "wa-do" },
      ],
      quiz: [
        { question: "How do you say 'Hello' in Cherokee?", options: ["ᎣᏍᏓ", "ᎣᏏᏲ", "ᏩᏙᏗᎢ", "ᏙᎾᏓᎪᎲ"], correct: 1 },
        { question: "What does 'ᏩᏙᏗᎢ' mean?", options: ["Hello", "Goodbye", "Thank you", "How are you?"], correct: 2 },
      ],
    },
  },
};

const Lesson = () => {
  const { languageId, lessonId } = useParams<{ languageId: string; lessonId: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { trackActivity, endActivity } = useActivityTracker();
  
  const [currentStep, setCurrentStep] = useState<"vocabulary" | "quiz" | "complete">("vocabulary");
  const [vocabIndex, setVocabIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const lesson = languageId && lessonId ? lessonData[languageId]?.[parseInt(lessonId)] : null;

  // Track activity on mount
  useEffect(() => {
    if (lesson) {
      trackActivity({
        sectionName: lesson.title,
        sectionType: "lesson",
      });
    }
    return () => {
      endActivity();
    };
  }, [lesson?.title]);

  const playPronunciation = async (word: string) => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      
      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
        body: { text: word, voice: "elder-male", language: languageId },
      });

      if (error) throw error;

      // For browser TTS fallback
      if (!data) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.7;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Convert base64 or blob response to audio
      const blob = new Blob([data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("TTS error:", err);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextVocab = () => {
    if (lesson && vocabIndex < lesson.vocabulary.length - 1) {
      setVocabIndex(vocabIndex + 1);
    } else {
      setCurrentStep("quiz");
      setVocabIndex(0);
    }
  };

  const handlePrevVocab = () => {
    if (vocabIndex > 0) {
      setVocabIndex(vocabIndex - 1);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === lesson?.quiz[quizIndex].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      toast({ title: "Correct! 🎉", description: "Great job!" });
    } else {
      toast({ title: "Not quite", description: "Keep practicing!", variant: "destructive" });
    }
  };

  const handleNextQuestion = () => {
    if (lesson && quizIndex < lesson.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setCurrentStep("complete");
    }
  };

  const resetLesson = () => {
    setCurrentStep("vocabulary");
    setVocabIndex(0);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-24">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-bold mb-4">Lesson Not Found</h1>
            <p className="text-muted-foreground mb-8">This lesson is not yet available.</p>
            <Button asChild>
              <Link to="/learn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Languages
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const totalSteps = lesson.vocabulary.length + lesson.quiz.length;
  const currentProgress =
    currentStep === "vocabulary"
      ? vocabIndex + 1
      : currentStep === "quiz"
      ? lesson.vocabulary.length + quizIndex + 1
      : totalSteps;

  return (
    <div className="min-h-screen bg-background">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={() => setIsPlaying(false)} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/learn/${languageId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Lesson
              </Link>
            </Button>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>{lesson.language}</span>
                <span>•</span>
                <span>{lesson.title}</span>
              </div>
              <Progress value={(currentProgress / totalSteps) * 100} className="h-2" />
            </div>
            
            <Badge variant="outline">
              {currentProgress} / {totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Vocabulary Step */}
            {currentStep === "vocabulary" && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Badge className="mb-6">Vocabulary {vocabIndex + 1} of {lesson.vocabulary.length}</Badge>
                
                <div className="mb-8">
                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
                    {lesson.vocabulary[vocabIndex].word}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-2">
                    {lesson.vocabulary[vocabIndex].translation}
                  </p>
                  <p className="text-primary">/{lesson.vocabulary[vocabIndex].phonetic}/</p>
                  
                  {lesson.vocabulary[vocabIndex].example && (
                    <p className="mt-4 text-sm text-muted-foreground italic">
                      "{lesson.vocabulary[vocabIndex].example}"
                    </p>
                  )}
                </div>

                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="lg"
                  onClick={() => playPronunciation(lesson.vocabulary[vocabIndex].word)}
                  className="mb-8"
                >
                  <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Playing..." : "Listen"}
                </Button>

                <div className="flex justify-between gap-4">
                  <Button variant="ghost" onClick={handlePrevVocab} disabled={vocabIndex === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="hero" onClick={handleNextVocab}>
                    {vocabIndex === lesson.vocabulary.length - 1 ? "Start Quiz" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Quiz Step */}
            {currentStep === "quiz" && (
              <div className="glass-card rounded-2xl p-8">
                <Badge className="mb-6">Question {quizIndex + 1} of {lesson.quiz.length}</Badge>
                
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
                  {lesson.quiz[quizIndex].question}
                </h2>

                <div className="space-y-3 mb-8">
                  {lesson.quiz[quizIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedAnswer === null
                          ? "bg-secondary/50 hover:bg-secondary"
                          : selectedAnswer === index
                          ? isCorrect
                            ? "bg-green-500/20 border-2 border-green-500"
                            : "bg-destructive/20 border-2 border-destructive"
                          : index === lesson.quiz[quizIndex].correct && selectedAnswer !== null
                          ? "bg-green-500/20 border-2 border-green-500"
                          : "bg-secondary/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium">{option}</span>
                        {selectedAnswer !== null && index === lesson.quiz[quizIndex].correct && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                        {selectedAnswer === index && !isCorrect && (
                          <XCircle className="w-5 h-5 text-destructive ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <Button variant="hero" onClick={handleNextQuestion} className="w-full">
                    {quizIndex === lesson.quiz.length - 1 ? "Complete Lesson" : "Next Question"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}

            {/* Complete Step */}
            {currentStep === "complete" && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Lesson Complete! 🎉
                </h2>
                
                <p className="text-xl text-muted-foreground mb-6">
                  You scored <span className="text-primary font-bold">{score}</span> out of{" "}
                  <span className="font-bold">{lesson.quiz.length}</span>
                </p>

                <div className="w-full max-w-xs mx-auto mb-8">
                  <Progress value={(score / lesson.quiz.length) * 100} className="h-4" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((score / lesson.quiz.length) * 100)}% accuracy
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetLesson}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Practice Again
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to={`/learn/${languageId}`}>
                      <Home className="w-4 h-4 mr-2" />
                      Back to Course
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lesson;
