import { Link } from "react-router-dom";
import { Globe, Heart, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-foreground">Lingua</span>
                <span className="text-gradient font-display text-lg font-semibold">Preserve</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Preserving endangered languages through AI-powered technology, connecting generations and cultures.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/record" className="text-muted-foreground hover:text-primary transition-colors text-sm">Record Language</Link></li>
              <li><Link to="/voice-generator" className="text-muted-foreground hover:text-primary transition-colors text-sm">AI Voice Generator</Link></li>
              <li><Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors text-sm">Learn Languages</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About the Problem</Link></li>
              <li><Link to="/impact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Impact</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-3">
              <li><Link to="/join" className="text-muted-foreground hover:text-primary transition-colors text-sm">Join Movement</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 LinguaPreserve. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for endangered languages
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
