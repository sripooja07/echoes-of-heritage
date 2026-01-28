import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Record from "./pages/Record";
import VoiceGenerator from "./pages/VoiceGenerator";
import Learn from "./pages/Learn";
import LanguagePath from "./pages/LanguagePath";
import Lesson from "./pages/Lesson";
import PracticeTest from "./pages/PracticeTest";
import Practice from "./pages/Practice";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Join from "./pages/Join";
import Impact from "./pages/Impact";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/learn/:languageId/practice-test" element={<PracticeTest />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/join" element={<Join />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminAuth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
