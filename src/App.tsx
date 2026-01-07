import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Record from "./pages/Record";
import VoiceGenerator from "./pages/VoiceGenerator";
import Learn from "./pages/Learn";
import LanguagePath from "./pages/LanguagePath";
import Lesson from "./pages/Lesson";
import Admin from "./pages/Admin";
import Join from "./pages/Join";
import Impact from "./pages/Impact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/record" element={<Record />} />
          <Route path="/voice-generator" element={<VoiceGenerator />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:languageId" element={<LanguagePath />} />
          <Route path="/learn/:languageId/lesson/:lessonId" element={<Lesson />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/join" element={<Join />} />
          <Route path="/impact" element={<Impact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
