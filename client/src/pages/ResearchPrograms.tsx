import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Rocket,
  TrendingUp,
  CheckCircle,
  Clock,
  Globe,
  Star,
  BookOpen,
  Target,
  Coins,
  ArrowUpRight,
  SlidersHorizontal,
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  X,
  Database
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { ResearchDAO } from "@shared/schema";
import QuickFundButtons from "@/components/investor/QuickFundButtons";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const categories = ["All", "Conservation Technology", "Quantum Computing", "Climate Science", "Indigenous Knowledge", "Biotechnology", "Renewable Energy", "Space Technology", "Neurotechnology", "Materials Science", "Educational Technology", "Healthcare Technology"];
const statuses = ["All", "Active", "Funding", "Completed", "Proposal"];
const locations = ["All", "Global", "Americas", "Europe", "Asia-Pacific", "Africa"];

export default function DAOSearch() {
  const { toast } = useToast();
  
  // Fetch DAOs from database
  const { data: daos = [], isLoading: daosLoading, error: daosError } = useQuery({
    queryKey: ["/api/research-daos"],
    queryFn: async (): Promise<ResearchDAO[]> => {
      const response = await fetch("/api/research-daos");
      if (!response.ok) {
        throw new Error("Failed to fetch research DAOs");
      }
      return response.json();
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [fundingRange, setFundingRange] = useState([0, 15000000]);
  const [sortBy, setSortBy] = useState("funding");
  const [filteredDAOs, setFilteredDAOs] = useState<ResearchDAO[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // AI Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your AI assistant for finding research DAOs. Ask me anything like "Show me climate science DAOs" or "Which DAOs need funding?"',
      timestamp: new Date(),
      suggestions: ['Show me active research DAOs', 'Find climate science projects', 'Which DAOs are recruiting?']
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AI Chat functions
  const sendChatMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: { availableDAOs: filteredDAOs }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      setChatMessages(prev => [...prev, botMessage]);

      // Apply filters based on AI suggestions
      applyAIRecommendations(message, data.response);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. You can still use the search filters to find DAOs manually.",
        timestamp: new Date(),
        suggestions: ['Try the search filters', 'Browse all DAOs', 'Contact support']
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyAIRecommendations = (userQuery: string, aiResponse: string) => {
    const query = userQuery.toLowerCase();

    // Auto-apply filters based on user query
    if (query.includes('climate') || query.includes('environment')) {
      setSelectedCategory('Climate Science');
    } else if (query.includes('ai') || query.includes('artificial intelligence')) {
      setSelectedCategory('Biotechnology');
    } else if (query.includes('quantum')) {
      setSelectedCategory('Quantum Computing');
    } else if (query.includes('biotech') || query.includes('biology')) {
      setSelectedCategory('Biotechnology');
    } else if (query.includes('indigenous')) {
      setSelectedCategory('Indigenous Knowledge');
    } else if (query.includes('conservation')) {
      setSelectedCategory('Conservation Technology');
    }

    if (query.includes('funding') || query.includes('investment')) {
      setSelectedStatus('Funding');
    } else if (query.includes('active') || query.includes('join')) {
      setSelectedStatus('Active');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendChatMessage(suggestion);
  };

  // Update filtered DAOs when data changes or filters change
  useEffect(() => {
    if (!daos.length) return;

    let filtered = daos.filter(dao => {
      const matchesSearch = dao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dao.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dao.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || dao.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || dao.status === selectedStatus;
      const matchesLocation = selectedLocation === "All" || dao.location === selectedLocation;
      const matchesFunding = dao.fundingRaised >= fundingRange[0] && dao.fundingRaised <= fundingRange[1];

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesFunding;
    });

    // Sort DAOs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "funding":
          return b.fundingRaised - a.fundingRaised;
        case "members":
          return b.memberCount - a.memberCount;
        case "activity":
          // For activity, we'd need proper date parsing, for now sort by lastActivity string
          return a.lastActivity.localeCompare(b.lastActivity);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredDAOs(filtered);
  }, [daos, searchTerm, selectedCategory, selectedStatus, selectedLocation, fundingRange, sortBy]);

  // Show loading state
  if (daosLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading research DAOs...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (daosError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading DAOs</h2>
          <p className="text-gray-600">Failed to load research DAOs. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          Research Programs
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Discover and join cutting-edge research DAOs driving breakthrough innovations in science, technology, and sustainability
        </p>
        
        {/* Create DAO Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create-dao">
            <Button className="bg-bitcoin-orange hover:bg-bitcoin-orange/90 text-white px-8 py-3 text-lg font-semibold">
              <Rocket className="w-5 h-5 mr-2" />
              Create a Research DAO
            </Button>
          </Link>
          <Link href="/add-existing-dao">
            <Button 
              variant="outline" 
              className="border-bitcoin-orange text-bitcoin-orange hover:bg-bitcoin-orange hover:text-white px-8 py-3 text-lg font-semibold"
            >
              <Database className="w-5 h-5 mr-2" />
              Add an Existing Research DAO
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredDAOs.length} research programs found
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search DAOs by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funding">Funding Raised</SelectItem>
                    <SelectItem value="members">Member Count</SelectItem>
                    <SelectItem value="activity">Last Activity</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Funding Range: ${fundingRange[0].toLocaleString()} - ${fundingRange[1].toLocaleString()}
              </label>
              <Slider
                value={fundingRange}
                onValueChange={setFundingRange}
                max={15000000}
                step={100000}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* DAO Grid */}
      <div className="space-y-4">
        {filteredDAOs.map((dao) => (
          <Card key={dao.id} className="hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Thumbnail Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img 
                    src={dao.image} 
                    alt={dao.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <Link href={`/dao/${dao.id}`} className="cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={dao.status === "Active" ? "default" : dao.status === "Funding" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {dao.status}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dao.lastActivity}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-bitcoin-orange">
                          {dao.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                          {dao.description}
                        </p>
                      </div>
                      
                      {/* Funding Progress */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${(dao.fundingRaised / 1000000).toFixed(1)}M / ${(dao.fundingGoal / 1000000).toFixed(1)}M
                        </div>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min((dao.fundingRaised / dao.fundingGoal) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.round((dao.fundingRaised / dao.fundingGoal) * 100)}% funded
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Row */}
                    <div className="flex items-center justify-between text-sm mt-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{dao.memberCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span>{dao.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Coins className="h-4 w-4" />
                          <span>{dao.tokenSymbol}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {dao.category}
                        </Badge>
                        {dao.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {dao.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{dao.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Quick Fund Section */}
                <div className="w-80 flex-shrink-0 ml-4">
                  <QuickFundButtons 
                    targetType="dao"
                    targetId={dao.id}
                    targetName={dao.name}
                    description="Quick invest in this DAO"
                    currentAmount={dao.fundingRaised}
                    goalAmount={dao.fundingGoal}
                    className="w-full"
                    data-testid={`quick-fund-dao-${dao.id}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDAOs.length === 0 && !daosLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No DAOs found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl mx-4 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">AI Research Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask about research DAOs..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage(chatInput);
                    }
                  }}
                  className="resize-none"
                  rows={3}
                />
                <Button
                  onClick={() => sendChatMessage(chatInput)}
                  disabled={!chatInput.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}