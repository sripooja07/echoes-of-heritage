import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Square, Play, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categories = [
  "Word / Vocabulary",
  "Sentence / Phrase",
  "Story / Narrative",
  "Folk Song",
  "Proverb / Saying",
  "Greeting / Expression",
];

const regions = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

// Suggested languages for quick selection
const suggestedLanguages = [
  // North America
  "Cherokee", "Navajo", "Yuchi", "Siletz Dee-ni", "Patwin",
  // Oceania
  "Māori", "Hawaiian", "Tanema", "Liki",
  // Europe
  "Welsh", "Basque", "Livonian", "Ter Sami",
  // Asia
  "Ainu", "Tibetan", "Odia", "Buryat", "Khmer", "Dzongkha", 
  "Sinhala", "Shan", "Lepcha", "Newari", "Mizo", "Konkani", "Dumi",
  // Africa
  "Njerep", "Ongota",
  // South America
  "Taushiro", "Tinigua", "Chamicuro",
];

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [formData, setFormData] = useState({
    language: "",
    region: "",
    category: "",
    transcription: "",
    translation: "",
    speakerAge: "",
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    toast({
      title: "Recording saved",
      description: "Your audio has been captured successfully.",
    });
  };

  const handlePlayback = () => {
    toast({
      title: "Playing recording",
      description: "Audio playback started.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Recording submitted!",
      description: "Thank you for your contribution to language preservation.",
    });
    setHasRecording(false);
    setFormData({
      language: "",
      region: "",
      category: "",
      transcription: "",
      translation: "",
      speakerAge: "",
    });
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
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contribute</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
                Record Your <span className="text-gradient">Language</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Your voice can help preserve endangered languages for future generations. 
                Record words, phrases, stories, or songs in your native tongue.
              </p>
            </div>
          </div>
        </section>

        {/* Recording Interface */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Recording Widget */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="font-display text-xl font-semibold mb-6 text-center">Audio Recording</h2>
                  
                  <div className="flex flex-col items-center space-y-6">
                    {/* Microphone Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isRecording
                            ? "bg-destructive animate-pulse"
                            : "bg-gradient-to-br from-primary to-accent hover:scale-105"
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-12 h-12 text-destructive-foreground" />
                        ) : (
                          <Mic className="w-12 h-12 text-primary-foreground" />
                        )}
                      </button>
                      
                      {/* Audio Waves Animation */}
                      {isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-primary rounded-full animate-wave"
                                style={{
                                  height: "40px",
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground text-center">
                      {isRecording
                        ? "Recording in progress... Click to stop"
                        : hasRecording
                        ? "Recording captured! Click to record again"
                        : "Click to start recording"}
                    </p>

                    {/* Playback Button */}
                    {hasRecording && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handlePlayback}
                        className="gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Play Recording
                      </Button>
                    )}

                    {/* Recording Status */}
                    <div className="flex items-center gap-2 text-sm">
                      {hasRecording ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Recording ready</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">No recording yet</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata Form */}
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <h2 className="font-display text-xl font-semibold">Recording Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language Name</Label>
                      <Input
                        id="language"
                        placeholder="e.g., Cherokee, Māori, Ainu"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData({ ...formData, region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="speakerAge">Speaker Age Group</Label>
                      <Select
                        value={formData.speakerAge}
                        onValueChange={(value) => setFormData({ ...formData, speakerAge: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-30">18-30</SelectItem>
                          <SelectItem value="31-50">31-50</SelectItem>
                          <SelectItem value="51-70">51-70</SelectItem>
                          <SelectItem value="70+">70+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transcription">Transcription (Native Script)</Label>
                    <Textarea
                      id="transcription"
                      placeholder="Write what you recorded in the native language..."
                      value={formData.transcription}
                      onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="translation">English Translation</Label>
                    <Textarea
                      id="translation"
                      placeholder="Provide an English translation..."
                      value={formData.translation}
                      onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    disabled={!hasRecording}
                    className="gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Submit Recording
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Record;
