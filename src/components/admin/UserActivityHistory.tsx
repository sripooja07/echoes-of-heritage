import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, Eye, Clock, BookOpen, Mic, Activity } from "lucide-react";
import { format, subDays } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  section_name: string;
  section_type: string;
  time_spent_seconds: number | null;
  accessed_at: string;
  profiles?: {
    display_name: string | null;
  } | null;
}

interface UserSummary {
  user_id: string;
  display_name: string | null;
  total_visits: number;
  last_active: string;
  sections_visited: string[];
}

const sectionTypeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="h-4 w-4" />,
  practice: <Activity className="h-4 w-4" />,
  quiz: <Activity className="h-4 w-4" />,
  record: <Mic className="h-4 w-4" />,
  profile: <Users className="h-4 w-4" />,
};

const sectionTypeColors: Record<string, string> = {
  lesson: "bg-blue-500/10 text-blue-600",
  practice: "bg-purple-500/10 text-purple-600",
  quiz: "bg-orange-500/10 text-orange-600",
  record: "bg-green-500/10 text-green-600",
  profile: "bg-gray-500/10 text-gray-600",
};

export function UserActivityHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("7days");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);

  // Fetch activity logs
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["activity-logs", dateFilter],
    queryFn: async () => {
      let startDate = new Date();
      
      switch (dateFilter) {
        case "today":
          startDate = subDays(new Date(), 1);
          break;
        case "7days":
          startDate = subDays(new Date(), 7);
          break;
        case "30days":
          startDate = subDays(new Date(), 30);
          break;
        case "all":
          startDate = new Date(0);
          break;
      }

      const { data: logs, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .gte("accessed_at", startDate.toISOString())
        .order("accessed_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      if (!logs) return [];

      // Fetch profiles for each log
      const userIds = [...new Set(logs.map((log) => log.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      return logs.map((log) => ({
        ...log,
        profiles: profileMap.get(log.user_id) || null,
      })) as ActivityLog[];
    },
  });

  // Fetch user detail when selected
  const { data: userActivities, isLoading: isLoadingUserDetail } = useQuery({
    queryKey: ["user-activity-detail", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;

      const { data: logs, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", selectedUserId)
        .order("accessed_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      if (!logs) return [];

      // Fetch profile for this user
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .eq("user_id", selectedUserId);

      const profile = profiles?.[0] || null;

      return logs.map((log) => ({
        ...log,
        profiles: profile,
      })) as ActivityLog[];
    },
    enabled: !!selectedUserId,
  });

  // Process activity logs into user summaries
  const userSummaries: UserSummary[] = activityLogs
    ? Object.values(
        activityLogs.reduce(
          (acc, log) => {
            if (!acc[log.user_id]) {
              acc[log.user_id] = {
                user_id: log.user_id,
                display_name: log.profiles?.display_name || "Anonymous",
                total_visits: 0,
                last_active: log.accessed_at,
                sections_visited: [],
              };
            }
            acc[log.user_id].total_visits++;
            if (!acc[log.user_id].sections_visited.includes(log.section_type)) {
              acc[log.user_id].sections_visited.push(log.section_type);
            }
            if (new Date(log.accessed_at) > new Date(acc[log.user_id].last_active)) {
              acc[log.user_id].last_active = log.accessed_at;
            }
            return acc;
          },
          {} as Record<string, UserSummary>
        )
      )
    : [];

  // Filter logs
  const filteredLogs = activityLogs?.filter((log) => {
    const matchesSearch =
      log.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.section_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection =
      sectionFilter === "all" || log.section_type === sectionFilter;
    return matchesSearch && matchesSection;
  });

  // Filter user summaries
  const filteredSummaries = userSummaries.filter((user) =>
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeSpent = (seconds: number | null) => {
    if (!seconds) return "—";
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setUserDetailOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            User Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              User Activity History
              {filteredSummaries.length > 0 && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                  {filteredSummaries.length} users
                </Badge>
              )}
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="lesson">Lessons</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="record">Record</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSummaries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No user activity recorded yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Total Visits</TableHead>
                  <TableHead>Sections Visited</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.display_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.total_visits}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.sections_visited.map((section) => (
                          <Badge
                            key={section}
                            variant="outline"
                            className={sectionTypeColors[section] || ""}
                          >
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(user.last_active), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user.user_id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              User Activity Details
            </DialogTitle>
          </DialogHeader>
          {isLoadingUserDetail ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : userActivities && userActivities.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{userActivities.length}</p>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">
                    {[...new Set(userActivities.map((a) => a.section_type))].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Sections</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">
                    {formatTimeSpent(
                      userActivities.reduce(
                        (sum, a) => sum + (a.time_spent_seconds || 0),
                        0
                      )
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">
                    {format(new Date(userActivities[0].accessed_at), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Accessed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.section_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={sectionTypeColors[activity.section_type] || ""}
                        >
                          <span className="mr-1">
                            {sectionTypeIcons[activity.section_type]}
                          </span>
                          {activity.section_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatTimeSpent(activity.time_spent_seconds)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(activity.accessed_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activity data found for this user</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
