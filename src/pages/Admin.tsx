import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  Users, 
  Mic, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Search,
  MoreHorizontal,
  Play,
  Eye,
  Pause,
  Download,
  Flag,
  UserCog,
  Mail,
  Ban,
  Award,
  Activity,
  Zap,
  Languages,
  FileAudio,
  Shield,
  Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const stats = [
  { label: "Total Recordings", value: "12,450", change: "+12%", icon: Mic },
  { label: "Languages Covered", value: "156", change: "+3", icon: Globe },
  { label: "Active Learners", value: "8,230", change: "+18%", icon: Users },
  { label: "Pending Reviews", value: "45", change: "-5", icon: Clock },
];

const pendingRecordings = [
  { id: 1, language: "Cherokee", category: "Word", speaker: "Mary Smith", speakerEmail: "mary@example.com", date: "2024-01-15", duration: "0:04", content: "Osiyo (Hello)", quality: 92 },
  { id: 2, language: "Navajo", category: "Story", speaker: "John Begay", speakerEmail: "john@example.com", date: "2024-01-15", duration: "2:35", content: "Traditional Creation Story", quality: 88 },
  { id: 3, language: "Māori", category: "Song", speaker: "Aroha Te Whare", speakerEmail: "aroha@example.com", date: "2024-01-14", duration: "1:48", content: "Pōkarekare Ana", quality: 95 },
  { id: 4, language: "Welsh", category: "Phrase", speaker: "Gareth Jones", speakerEmail: "gareth@example.com", date: "2024-01-14", duration: "0:12", content: "Bore da (Good morning)", quality: 90 },
  { id: 5, language: "Hawaiian", category: "Word", speaker: "Kaia Kalama", speakerEmail: "kaia@example.com", date: "2024-01-13", duration: "0:06", content: "Aloha (Love/Hello)", quality: 94 },
];

const recentUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "Contributor", joined: "2024-01-15", recordings: 24, languages: ["Cherokee", "Navajo"], verified: true, avatar: "👩‍🦰" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", role: "Learner", joined: "2024-01-14", recordings: 0, languages: ["Māori"], verified: true, avatar: "👨‍💼" },
  { id: 3, name: "Emma Davis", email: "emma@example.com", role: "Contributor", joined: "2024-01-14", recordings: 12, languages: ["Welsh"], verified: false, avatar: "👩" },
  { id: 4, name: "James Wilson", email: "james@example.com", role: "Researcher", joined: "2024-01-13", recordings: 3, languages: ["Hawaiian", "Cherokee"], verified: true, avatar: "👨‍🔬" },
  { id: 5, name: "Linda Brown", email: "linda@example.com", role: "Contributor", joined: "2024-01-12", recordings: 45, languages: ["Navajo"], verified: true, avatar: "👩‍🏫" },
];

const activityFeed = [
  { id: 1, action: "New recording submitted", user: "Mary Smith", time: "2 min ago", type: "recording" },
  { id: 2, action: "User verified", user: "John Begay", time: "15 min ago", type: "verification" },
  { id: 3, action: "Recording approved", user: "Admin", time: "1 hour ago", type: "approval" },
  { id: 4, action: "New learner joined", user: "Emma Davis", time: "2 hours ago", type: "join" },
  { id: 5, action: "Language milestone reached", user: "Cherokee", time: "3 hours ago", type: "milestone" },
];

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof recentUsers[0] | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<typeof pendingRecordings[0] | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);

  const handlePlayRecording = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
      toast({ title: "Playback stopped" });
    } else {
      setPlayingId(id);
      toast({ title: "Playing recording...", description: "Audio playback simulation" });
      // Simulate playback ending
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleApproveRecording = (id: number) => {
    toast({ 
      title: "Recording Approved ✓", 
      description: "The recording has been added to the database.",
    });
  };

  const handleRejectRecording = (id: number) => {
    toast({ 
      title: "Recording Rejected", 
      description: "The contributor will be notified.",
      variant: "destructive"
    });
  };

  const handleViewUser = (user: typeof recentUsers[0]) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleViewRecording = (recording: typeof pendingRecordings[0]) => {
    setSelectedRecording(recording);
    setRecordingDialogOpen(true);
  };

  const handleSendEmail = (email: string) => {
    toast({ title: "Email dialog opened", description: `Composing email to ${email}` });
  };

  const handlePromoteUser = (name: string) => {
    toast({ title: "User Promoted", description: `${name} has been promoted to Contributor` });
  };

  const handleBanUser = (name: string) => {
    toast({ title: "User Banned", description: `${name} has been banned from the platform`, variant: "destructive" });
  };

  const handleDownloadRecording = (id: number) => {
    toast({ title: "Download Started", description: "Recording file is being prepared..." });
  };

  const handleFlagRecording = (id: number) => {
    toast({ title: "Recording Flagged", description: "This recording has been flagged for further review" });
  };

  const filteredRecordings = pendingRecordings.filter(r => 
    r.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = recentUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold">
                      Admin <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground">
                      Manage languages, users, and content
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recordings, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isPositive = stat.change.startsWith("+");
                return (
                  <div key={index} className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={isPositive 
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/30"
                        }
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <FileAudio className="w-4 h-4" />
                Bulk Approve
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Languages className="w-4 h-4" />
                Add Language
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Award className="w-4 h-4" />
                Send Badges
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Tabs - 2/3 width */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="recordings" className="space-y-6">
                  <TabsList className="glass-card p-1 w-full md:w-auto">
                    <TabsTrigger value="recordings" className="flex-1 md:flex-none gap-2">
                      <Mic className="w-4 h-4" />
                      Pending ({filteredRecordings.length})
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex-1 md:flex-none gap-2">
                      <Users className="w-4 h-4" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex-1 md:flex-none gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  {/* Pending Recordings */}
                  <TabsContent value="recordings" className="space-y-4">
                    <div className="glass-card rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold">Recordings Awaiting Review</h2>
                        <Badge variant="outline">{filteredRecordings.length} pending</Badge>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-secondary/50">
                            <tr>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Content</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Language</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Speaker</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quality</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRecordings.map((recording) => (
                              <tr key={recording.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                <td className="p-4">
                                  <div>
                                    <p className="font-medium">{recording.content}</p>
                                    <p className="text-xs text-muted-foreground">{recording.duration} • {recording.category}</p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline">{recording.language}</Badge>
                                </td>
                                <td className="p-4 text-muted-foreground">{recording.speaker}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Progress value={recording.quality} className="w-16 h-2" />
                                    <span className="text-xs text-muted-foreground">{recording.quality}%</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant={playingId === recording.id ? "default" : "ghost"} 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => handlePlayRecording(recording.id)}
                                    >
                                      {playingId === recording.id ? (
                                        <Pause className="w-4 h-4" />
                                      ) : (
                                        <Play className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                      onClick={() => handleApproveRecording(recording.id)}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                      onClick={() => handleRejectRecording(recording.id)}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleViewRecording(recording)}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownloadRecording(recording.id)}>
                                          <Download className="w-4 h-4 mr-2" />
                                          Download Audio
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleFlagRecording(recording.id)}>
                                          <Flag className="w-4 h-4 mr-2" />
                                          Flag for Review
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleSendEmail(recording.speakerEmail)}>
                                          <Mail className="w-4 h-4 mr-2" />
                                          Contact Speaker
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Recent Users */}
                  <TabsContent value="users" className="space-y-4">
                    <div className="glass-card rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold">User Management</h2>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Users className="w-4 h-4" />
                          Invite User
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-secondary/50">
                            <tr>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Languages</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Recordings</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                                      {user.avatar}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium">{user.name}</p>
                                        {user.verified && (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge 
                                    variant="outline"
                                    className={
                                      user.role === "Contributor" 
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : user.role === "Researcher"
                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                        : "bg-secondary"
                                    }
                                  >
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-1 flex-wrap">
                                    {user.languages.slice(0, 2).map((lang, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {lang}
                                      </Badge>
                                    ))}
                                    {user.languages.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{user.languages.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Mic className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{user.recordings}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => handleViewUser(user)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSendEmail(user.email)}>
                                          <Mail className="w-4 h-4 mr-2" />
                                          Send Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePromoteUser(user.name)}>
                                          <UserCog className="w-4 h-4 mr-2" />
                                          Change Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: "Badge Awarded", description: `${user.name} received a badge!` })}>
                                          <Award className="w-4 h-4 mr-2" />
                                          Award Badge
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          className="text-destructive"
                                          onClick={() => handleBanUser(user.name)}
                                        >
                                          <Ban className="w-4 h-4 mr-2" />
                                          Ban User
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Analytics */}
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Top Languages */}
                      <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-display text-lg font-semibold mb-4">Top Languages by Recordings</h3>
                        <div className="space-y-4">
                          {[
                            { name: "Navajo", count: 3250, percentage: 85, flag: "🏜️" },
                            { name: "Welsh", count: 2840, percentage: 74, flag: "🏰" },
                            { name: "Māori", count: 2120, percentage: 55, flag: "🌊" },
                            { name: "Cherokee", count: 1890, percentage: 49, flag: "🏔️" },
                            { name: "Hawaiian", count: 1540, percentage: 40, flag: "🌺" },
                          ].map((lang, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium flex items-center gap-2">
                                  <span>{lang.flag}</span>
                                  {lang.name}
                                </span>
                                <span className="text-muted-foreground">{lang.count.toLocaleString()}</span>
                              </div>
                              <Progress value={lang.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weekly Stats */}
                      <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-display text-lg font-semibold mb-4">This Week's Highlights</h3>
                        <div className="space-y-4">
                          {[
                            { label: "New Recordings", value: 234, icon: Mic, color: "text-green-400" },
                            { label: "New Learners", value: 89, icon: Users, color: "text-blue-400" },
                            { label: "Lessons Completed", value: 1245, icon: CheckCircle, color: "text-primary" },
                            { label: "Hours of Audio", value: 48, icon: Clock, color: "text-purple-400" },
                          ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${item.color}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm">{item.label}</span>
                                </div>
                                <span className="font-display text-xl font-bold">{item.value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Activity Feed - 1/3 width */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold">Activity Feed</h3>
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          activity.type === "recording" ? "bg-primary/20 text-primary" :
                          activity.type === "verification" ? "bg-green-500/20 text-green-400" :
                          activity.type === "approval" ? "bg-blue-500/20 text-blue-400" :
                          activity.type === "milestone" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {activity.type === "recording" && <Mic className="w-4 h-4" />}
                          {activity.type === "verification" && <CheckCircle className="w-4 h-4" />}
                          {activity.type === "approval" && <CheckCircle className="w-4 h-4" />}
                          {activity.type === "join" && <Users className="w-4 h-4" />}
                          {activity.type === "milestone" && <Award className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-muted-foreground">
                    View All Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* User Detail Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{selectedUser?.avatar}</span>
              <div>
                <span className="flex items-center gap-2">
                  {selectedUser?.name}
                  {selectedUser?.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                </span>
                <p className="text-sm font-normal text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
            <DialogDescription>User profile and statistics</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-2xl font-bold">{selectedUser.recordings}</p>
                  <p className="text-xs text-muted-foreground">Recordings</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-2xl font-bold">{selectedUser.languages.length}</p>
                  <p className="text-xs text-muted-foreground">Languages</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.languages.map((lang, i) => (
                    <Badge key={i} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Joined {selectedUser.joined}
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2" onClick={() => handleSendEmail(selectedUser.email)}>
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => handlePromoteUser(selectedUser.name)}>
                  <UserCog className="w-4 h-4" />
                  Edit Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recording Detail Dialog */}
      <Dialog open={recordingDialogOpen} onOpenChange={setRecordingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording Details</DialogTitle>
            <DialogDescription>Review recording information</DialogDescription>
          </DialogHeader>
          {selectedRecording && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-xl font-display font-bold text-gradient">{selectedRecording.content}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecording.language} • {selectedRecording.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Speaker</p>
                  <p className="font-medium">{selectedRecording.speaker}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedRecording.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedRecording.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quality Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedRecording.quality} className="flex-1 h-2" />
                    <span className="font-medium">{selectedRecording.quality}%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApproveRecording(selectedRecording.id);
                    setRecordingDialogOpen(false);
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 gap-2"
                  onClick={() => {
                    handleRejectRecording(selectedRecording.id);
                    setRecordingDialogOpen(false);
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
