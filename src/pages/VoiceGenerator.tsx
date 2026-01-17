import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, Play, Download, Volume2, Sparkles, Pause, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const languages = [
  // Original languages
  { id: "cherokee", name: "Cherokee", speakers: "2,000" },
  { id: "maori", name: "Māori", speakers: "50,000" },
  { id: "navajo", name: "Navajo", speakers: "170,000" },
  { id: "welsh", name: "Welsh", speakers: "750,000" },
  { id: "basque", name: "Basque", speakers: "750,000" },
  { id: "hawaiian", name: "Hawaiian", speakers: "24,000" },
  // Asian Languages
  { id: "ainu", name: "Ainu", speakers: "10" },
  { id: "tibetan", name: "Tibetan", speakers: "1,200,000" },
  { id: "odia", name: "Odia", speakers: "35,000,000" },
  { id: "buryat", name: "Buryat", speakers: "265,000" },
  { id: "khmer", name: "Khmer", speakers: "16,000,000" },
  { id: "dzongkha", name: "Dzongkha", speakers: "640,000" },
  { id: "sinhala", name: "Sinhala", speakers: "17,000,000" },
  { id: "shan", name: "Shan", speakers: "3,300,000" },
  { id: "lepcha", name: "Lepcha", speakers: "50,000" },
  { id: "newari", name: "Newari", speakers: "860,000" },
  { id: "mizo", name: "Mizo", speakers: "830,000" },
  { id: "konkani", name: "Konkani", speakers: "2,500,000" },
  // Critically Endangered
  { id: "yuchi", name: "Yuchi", speakers: "4" },
  { id: "livonian", name: "Livonian", speakers: "20" },
  { id: "siletz", name: "Siletz Dee-ni", speakers: "1" },
  { id: "tanema", name: "Tanema", speakers: "1" },
  { id: "njerep", name: "Njerep", speakers: "4" },
  { id: "chulym", name: "Chulym", speakers: "44" },
  { id: "ter-sami", name: "Ter Sami", speakers: "2" },
  { id: "ongota", name: "Ongota", speakers: "12" },
  { id: "liki", name: "Liki", speakers: "11" },
  { id: "taushiro", name: "Taushiro", speakers: "1" },
  { id: "tinigua", name: "Tinigua", speakers: "1" },
  { id: "patwin", name: "Patwin", speakers: "3" },
  { id: "chamicuro", name: "Chamicuro", speakers: "8" },
  { id: "dumi", name: "Dumi", speakers: "8" },
];

const voices = [
  { id: "elder-male", name: "Elder Male", description: "Deep, wise voice" },
  { id: "elder-female", name: "Elder Female", description: "Warm, nurturing voice" },
  { id: "young-male", name: "Young Male", description: "Clear, energetic voice" },
  { id: "young-female", name: "Young Female", description: "Bright, melodic voice" },
];

const VoiceGenerator = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [speed, setSpeed] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!text || !language || !voice) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text, 
            voiceType: voice,
            speed: speed[0],
            language
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      
      // Get translated text from response header
      const translated = response.headers.get("X-Translated-Text");
      if (translated) {
        setTranslatedText(decodeURIComponent(translated));
      }
      
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
      setHasAudio(true);
      
      const langName = languages.find(l => l.id === language)?.name || language;
      toast({
        title: "Audio generated!",
        description: `Text translated to ${langName} and synthesized.`,
      });
    } catch (error) {
      console.error("TTS error:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    if (!audioUrl) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${language}-${voice}-speech.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your audio file is being downloaded.",
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
                AI <span className="text-gradient">Voice Generator</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Generate natural-sounding speech in endangered languages using our AI voice models 
                trained on native speaker recordings.
              </p>
            </div>
          </div>
        </section>

        {/* Generator Interface */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card rounded-2xl p-8 space-y-6">
                    <h2 className="font-display text-xl font-semibold">Text Translator</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Select Language</Label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose language" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.id} value={lang.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{lang.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ~{lang.speakers} speakers
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Voice Model</Label>
                          <Select value={voice} onValueChange={setVoice}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose voice" />
                            </SelectTrigger>
                            <SelectContent>
                              {voices.map((v) => (
                                <SelectItem key={v.id} value={v.id}>
                                  <div>
                                    <span>{v.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {v.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="text">Enter Text</Label>
                        <Textarea
                          id="text"
                          placeholder="Enter the text you want to convert to speech..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={6}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {text.length} characters
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Speech Speed</Label>
                          <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                        </div>
                        <Slider
                          value={speed}
                          onValueChange={setSpeed}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full gap-2"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          Generate Speech
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl p-8 space-y-6">
                    <h2 className="font-display text-xl font-semibold">Generated Audio</h2>

                    {/* Translated Text Display */}
                    {translatedText && (
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-xs text-primary font-medium mb-1">Translated Text:</p>
                        <p className="text-foreground font-medium">{translatedText}</p>
                      </div>
                    )}

                    {/* Audio Visualization */}
                    <div className="relative h-32 bg-secondary/50 rounded-xl flex items-center justify-center overflow-hidden">
                      {hasAudio ? (
                        <div className="flex items-end justify-center gap-1 h-20">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 bg-gradient-to-t from-primary to-accent rounded-full ${isPlaying ? 'animate-wave' : ''}`}
                              style={{
                                height: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.05}s`,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Volume2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No audio generated yet</p>
                        </div>
                      )}
                    </div>

                    {/* Hidden Audio Element */}
                    {audioUrl && (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        onError={() => {
                          setIsPlaying(false);
                          toast({
                            title: "Playback error",
                            description: "Could not play the audio.",
                            variant: "destructive",
                          });
                        }}
                      />
                    )}

                    {/* Playback Controls */}
                    <div className="flex gap-2">
                      <Button
                        variant={isPlaying ? "default" : "outline"}
                        size="lg"
                        className="flex-1 gap-2"
                        onClick={handlePlay}
                        disabled={!hasAudio}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-5 h-5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        onClick={handleStop}
                        disabled={!hasAudio || !isPlaying}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 gap-2"
                        onClick={handleDownload}
                        disabled={!hasAudio}
                      >
                        <Download className="w-5 h-5" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">1.</span>
                        Our AI is trained on authentic native speaker recordings
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">2.</span>
                        Text is processed with language-specific phonetics
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">3.</span>
                        Natural-sounding speech is synthesized in real-time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VoiceGenerator;
