import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    details?: string;
    link?: string;
    linkLabel?: string;
  } | null;
}

const FeatureDialog = ({ open, onOpenChange, feature }: FeatureDialogProps) => {
  if (!feature) return null;
  
  const Icon = feature.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-2xl">{feature.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {feature.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {feature.details && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.details}
            </p>
          )}
          
          {feature.link && (
            <Button variant="hero" className="w-full gap-2" asChild>
              <Link to={feature.link}>
                {feature.linkLabel || "Learn More"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDialog;
