import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Eye
} from "lucide-react";

const stats = [
  { label: "Total Recordings", value: "12,450", change: "+12%", icon: Mic },
  { label: "Languages Covered", value: "156", change: "+3", icon: Globe },
  { label: "Active Learners", value: "8,230", change: "+18%", icon: Users },
  { label: "Pending Reviews", value: "45", change: "-5", icon: Clock },
];

const pendingRecordings = [
  { id: 1, language: "Cherokee", category: "Word", speaker: "Mary Smith", date: "2024-01-15", duration: "0:04" },
  { id: 2, language: "Navajo", category: "Story", speaker: "John Begay", date: "2024-01-15", duration: "2:35" },
  { id: 3, language: "Māori", category: "Song", speaker: "Aroha Te Whare", date: "2024-01-14", duration: "1:48" },
  { id: 4, language: "Welsh", category: "Phrase", speaker: "Gareth Jones", date: "2024-01-14", duration: "0:12" },
  { id: 5, language: "Hawaiian", category: "Word", speaker: "Kaia Kalama", date: "2024-01-13", duration: "0:06" },
];

const recentUsers = [
  { id: 1, name: "Sarah Johnson", role: "Contributor", joined: "2024-01-15", recordings: 24 },
  { id: 2, name: "Michael Chen", role: "Learner", joined: "2024-01-14", recordings: 0 },
  { id: 3, name: "Emma Davis", role: "Contributor", joined: "2024-01-14", recordings: 12 },
  { id: 4, name: "James Wilson", role: "Researcher", joined: "2024-01-13", recordings: 3 },
  { id: 5, name: "Linda Brown", role: "Contributor", joined: "2024-01-12", recordings: 45 },
];

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  Admin <span className="text-gradient">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage languages, users, and content
                </p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
                return (
                  <div key={index} className="glass-card rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
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

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="recordings" className="space-y-6">
              <TabsList className="glass-card p-1 w-full md:w-auto">
                <TabsTrigger value="recordings" className="flex-1 md:flex-none gap-2">
                  <Mic className="w-4 h-4" />
                  Pending Recordings
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-1 md:flex-none gap-2">
                  <Users className="w-4 h-4" />
                  Recent Users
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 md:flex-none gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Pending Recordings */}
              <TabsContent value="recordings" className="space-y-4">
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-display text-lg font-semibold">Recordings Awaiting Review</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Language</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Speaker</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRecordings.map((recording) => (
                          <tr key={recording.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="p-4 font-medium">{recording.language}</td>
                            <td className="p-4">
                              <Badge variant="outline">{recording.category}</Badge>
                            </td>
                            <td className="p-4 text-muted-foreground">{recording.speaker}</td>
                            <td className="p-4 text-muted-foreground">{recording.duration}</td>
                            <td className="p-4 text-muted-foreground">{recording.date}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Play className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                                  <XCircle className="w-4 h-4" />
                                </Button>
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
                  <div className="p-4 border-b border-border">
                    <h2 className="font-display text-lg font-semibold">Recently Joined Users</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Recordings</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="p-4 font-medium">{user.name}</td>
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
                            <td className="p-4 text-muted-foreground">{user.joined}</td>
                            <td className="p-4 text-muted-foreground">{user.recordings}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart Placeholder */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Recording Activity</h3>
                    <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-xl">
                      <div className="text-center text-muted-foreground">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Analytics Chart</p>
                        <p className="text-sm">Connect database for live data</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Languages */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Top Languages by Recordings</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Navajo", count: 3250, percentage: 85 },
                        { name: "Welsh", count: 2840, percentage: 74 },
                        { name: "Māori", count: 2120, percentage: 55 },
                        { name: "Cherokee", count: 1890, percentage: 49 },
                        { name: "Hawaiian", count: 1540, percentage: 40 },
                      ].map((lang, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-muted-foreground">{lang.count} recordings</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                              style={{ width: `${lang.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
