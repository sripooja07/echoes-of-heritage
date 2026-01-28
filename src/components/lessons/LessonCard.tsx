import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  example_sentences: string[];
  difficulty: string;
  order_index: number;
}

interface LessonCardProps {
  lesson: Lesson;
  languageEmoji: string;
  index: number;
  getDifficultyColor: (difficulty: string) => string;
}

const LessonCard = ({ lesson, languageEmoji, index, getDifficultyColor }: LessonCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500">
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{languageEmoji}</span>
          <span className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center font-bold text-primary">
            {index + 1}
          </span>
        </div>
        <Badge
          className={`absolute top-4 right-4 capitalize ${getDifficultyColor(lesson.difficulty)}`}
          variant="outline"
        >
          {lesson.difficulty}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {lesson.title}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {lesson.content}
        </p>

        {/* Example Sentences Toggle */}
        {lesson.example_sentences.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full justify-between gap-2 text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {lesson.example_sentences.length} Example Sentences
              </span>
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {expanded && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                {lesson.example_sentences.map((sentence, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-secondary/50 text-sm text-foreground"
                  >
                    <span className="text-primary font-medium mr-2">•</span>
                    {sentence}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>Lesson {lesson.order_index}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{lesson.example_sentences.length} examples</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
