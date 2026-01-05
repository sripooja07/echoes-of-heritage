import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Code, Users, Handshake, Mail, ExternalLink } from "lucide-react";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "documentation" | "api" | "contribute" | "partners" | "contact" | null;
}

const infoData = {
  documentation: {
    icon: FileText,
    title: "Documentation",
    description: "Comprehensive guides and tutorials for using the LinguaPreserve platform.",
    content: "Our documentation covers everything from getting started with voice recording to advanced AI model training. Learn best practices for capturing high-quality audio, organizing language data, and creating effective learning materials.",
    cta: "View Documentation",
  },
  api: {
    icon: Code,
    title: "API Access",
    description: "Integrate LinguaPreserve capabilities into your own applications.",
    content: "Our RESTful API provides access to text-to-speech synthesis, speech recognition, and language learning resources. Perfect for researchers, developers, and organizations building language preservation tools.",
    cta: "Explore API",
  },
  contribute: {
    icon: Users,
    title: "Contribute",
    description: "Join our community of contributors and help preserve endangered languages.",
    content: "There are many ways to contribute: record your native language, help transcribe audio, translate learning materials, develop new features, or spread awareness. Every contribution matters in our mission to save endangered languages.",
    cta: "Get Involved",
  },
  partners: {
    icon: Handshake,
    title: "Research Partners",
    description: "Collaborate with us on language preservation research and projects.",
    content: "We partner with universities, linguistic research institutions, and cultural organizations worldwide. Together, we develop new methodologies for language documentation, create AI models for low-resource languages, and build sustainable preservation programs.",
    cta: "Partner With Us",
  },
  contact: {
    icon: Mail,
    title: "Contact Us",
    description: "Get in touch with our team for support, partnerships, or inquiries.",
    content: "Have questions about our platform? Interested in a partnership? Need technical support? We'd love to hear from you. Our team is dedicated to supporting language preservation efforts worldwide.",
    cta: "Send Message",
  },
};

const InfoDialog = ({ open, onOpenChange, type }: InfoDialogProps) => {
  if (!type) return null;
  
  const data = infoData[type];
  const Icon = data.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
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
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.content}
          </p>
          
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground text-center">
              This feature is coming soon. Sign up to be notified when it launches!
            </p>
          </div>
          
          <Button variant="hero" className="w-full gap-2" onClick={() => onOpenChange(false)}>
            {data.cta}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
