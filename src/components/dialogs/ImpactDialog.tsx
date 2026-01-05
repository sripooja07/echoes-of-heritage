import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon, TrendingUp } from "lucide-react";

interface ImpactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  impact: {
    icon: LucideIcon;
    value: string;
    label: string;
    description: string;
    details?: string;
    stats?: { label: string; value: string }[];
  } | null;
}

const ImpactDialog = ({ open, onOpenChange, impact }: ImpactDialogProps) => {
  if (!impact) return null;
  
  const Icon = impact.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <span className="text-gradient">{impact.value}</span>
            <span className="text-foreground">{impact.label}</span>
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {impact.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {impact.details && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {impact.details}
            </p>
          )}
          
          {impact.stats && (
            <div className="grid grid-cols-2 gap-3">
              {impact.stats.map((stat, index) => (
                <div key={index} className="glass-card rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Growing every day with community contributions
            </p>
          </div>
          
          <Button variant="hero" className="w-full gap-2" asChild>
            <Link to="/impact">
              See Full Impact Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImpactDialog;
