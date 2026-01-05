import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter, Github, Linkedin, ExternalLink } from "lucide-react";

interface SocialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: "twitter" | "github" | "linkedin" | null;
}

const socialData = {
  twitter: {
    icon: Twitter,
    title: "Follow Us on Twitter",
    description: "Stay updated with the latest news, language preservation tips, and community stories.",
    handle: "@LinguaPreserve",
    url: "https://twitter.com/linguapreserve",
  },
  github: {
    icon: Github,
    title: "Contribute on GitHub",
    description: "Our platform is open source. Help us build tools that preserve endangered languages for future generations.",
    handle: "linguapreserve",
    url: "https://github.com/linguapreserve",
  },
  linkedin: {
    icon: Linkedin,
    title: "Connect on LinkedIn",
    description: "Join our professional network of linguists, researchers, and language preservation advocates.",
    handle: "LinguaPreserve",
    url: "https://linkedin.com/company/linguapreserve",
  },
};

const SocialDialog = ({ open, onOpenChange, platform }: SocialDialogProps) => {
  if (!platform) return null;
  
  const data = socialData[platform];
  const Icon = data.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-xl">{data.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {data.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-primary font-semibold">{data.handle}</p>
          </div>
          
          <Button variant="hero" className="w-full gap-2" asChild>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              Visit Profile
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialDialog;
