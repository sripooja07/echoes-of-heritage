import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Square, Play, Pause, Upload, CheckCircle, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

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

const Record = () => {
  const { user } = useAuth();
  const { trackActivity, endActivity } = useActivityTracker();
  const queryClient = useQueryClient();
  
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    isPlaying,
    resetRecording,
    error: recordingError,
  } = useAudioRecorder();

  const [formData, setFormData] = useState({
    language: "",
    region: "",
    category: "",
    transcription: "",
    translation: "",
    speakerAge: "",
    lessonName: "",
  });

  // Track activity on mount
  useEffect(() => {
    trackActivity({
      sectionName: "Voice Recording",
      sectionType: "record",
    });
    return () => {
      endActivity();
    };
  }, []);

  // Show recording error
  useEffect(() => {
    if (recordingError) {
      toast({
        title: "Microphone Error",
        description: recordingError,
        variant: "destructive",
      });
    }
  }, [recordingError]);

  // Fetch languages from database
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("languages").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Submit voice note mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to submit recordings");
      if (!audioBlob) throw new Error("No recording to submit");

      // Upload audio file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("voice-recordings")
        .upload(fileName, audioBlob, {
          contentType: audioBlob.type,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("voice-recordings")
        .getPublicUrl(uploadData.path);

      // Insert voice note record
      const { error } = await supabase.from("voice_notes").insert({
        user_id: user.id,
        language_name: formData.language,
        lesson_name: formData.lessonName || formData.category,
        audio_url: urlData.publicUrl,
        transcription: formData.transcription,
        translation: formData.translation,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-notes"] });
      toast({
        title: "Recording submitted!",
        description: "Thank you for your contribution. An admin will review it shortly.",
      });
      resetRecording();
      setFormData({
        language: "",
        region: "",
        category: "",
        transcription: "",
        translation: "",
        speakerAge: "",
        lessonName: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording();
      toast({
        title: "Recording saved",
        description: "Your audio has been captured successfully.",
      });
    } else {
      await startRecording();
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      playRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit recordings.",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate();
  };

  const hasRecording = !!audioBlob;

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
                        onClick={handleRecordToggle}
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

                    {/* Playback Controls */}
                    {hasRecording && (
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={handlePlayToggle}
                          className="gap-2"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-5 h-5" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              Play Recording
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          onClick={resetRecording}
                          className="gap-2"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Re-record
                        </Button>
                      </div>
                    )}

                    {/* Audio Player (native HTML5 for full controls) */}
                    {audioUrl && (
                      <audio 
                        src={audioUrl} 
                        controls 
                        className="w-full max-w-md"
                      />
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
                    disabled={!hasRecording || submitMutation.isPending}
                    className="gap-2"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    {submitMutation.isPending ? "Submitting..." : "Submit Recording"}
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
