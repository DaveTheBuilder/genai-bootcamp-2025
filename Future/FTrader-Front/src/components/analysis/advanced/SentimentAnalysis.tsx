import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  LineChart, 
  RefreshCw,
  Download,
  Globe,
  MessageSquare,
  Newspaper,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Search
} from "lucide-react";

// Mock sentiment data
const mockSentimentData = {
  overallSentiment: 0.65, // -1 to 1 scale
  sentimentTrend: 0.08, // change from previous period
  sources: {
    news: 0.72,
    twitter: 0.58,
    reddit: 0.62,
    stocktwits: 0.70,
    blogs: 0.55
  },
  topMentions: [
    { entity: "FTSE 100", mentions: 245, sentiment: 0.68, change: 0.12 },
    { entity: "Bank of England", mentions: 187, sentiment: 0.42, change: -0.05 },
    { entity: "Inflation", mentions: 156, sentiment: -0.25, change: 0.08 },
    { entity: "Interest Rates", mentions: 132, sentiment: -0.18, change: 0.03 },
    { entity: "Brexit", mentions: 98, sentiment: -0.35, change: -0.12 },
    { entity: "Housing Market", mentions: 87, sentiment: 0.22, change: 0.15 },
    { entity: "Energy Prices", mentions: 76, sentiment: -0.28, change: 0.05 },
    { entity: "Tech Sector", mentions: 65, sentiment: 0.75, change: 0.18 }
  ],
  sentimentByAsset: [
    { asset: "IX.D.FTSE.DAILY.IP", name: "FTSE 100", sentiment: 0.68, mentions: 245, priceCorrelation: 0.72 },
    { asset: "IX.D.DAX.DAILY.IP", name: "DAX", sentiment: 0.62, mentions: 124, priceCorrelation: 0.65 },
    { asset: "CS.D.EURUSD.TODAY.IP", name: "EUR/USD", sentiment: 0.45, mentions: 178, priceCorrelation: 0.58 },
    { asset: "CS.D.GBPUSD.TODAY.IP", name: "GBP/USD", sentiment: 0.52, mentions: 156, priceCorrelation: 0.63 },
    { asset: "CC.D.LCO.UNC.IP", name: "Brent Crude", sentiment: -0.15, mentions: 98, priceCorrelation: 0.48 },
    { asset: "CS.D.BITCOIN.TODAY.IP", name: "Bitcoin", sentiment: 0.78, mentions: 212, priceCorrelation: 0.82 }
  ],
  recentNews: [
    { 
      title: "FTSE 100 reaches new highs as tech stocks surge", 
      source: "Financial Times", 
      time: "2 hours ago", 
      sentiment: 0.85, 
      url: "#",
      snippet: "The FTSE 100 reached a new record high today, driven by strong performance in the technology sector..."
    },
    { 
      title: "Bank of England signals potential rate hold amid inflation concerns", 
      source: "Reuters", 
      time: "4 hours ago", 
      sentiment: 0.25, 
      url: "#",
      snippet: "The Bank of England has indicated it may hold interest rates at current levels as inflation shows signs of stabilizing..."
    },
    { 
      title: "Energy prices expected to rise further in coming months", 
      source: "Bloomberg", 
      time: "6 hours ago", 
      sentiment: -0.45, 
      url: "#",
      snippet: "Analysts predict energy prices will continue to climb through the summer months due to supply constraints and increased demand..."
    },
    { 
      title: "Housing market shows resilience despite economic headwinds", 
      source: "The Guardian", 
      time: "8 hours ago", 
      sentiment: 0.38, 
      url: "#",
      snippet: "The UK housing market has demonstrated unexpected resilience in the face of economic challenges, with prices holding steady..."
    },
    { 
      title: "Tech sector leads market gains amid positive earnings reports", 
      source: "CNBC", 
      time: "10 hours ago", 
      sentiment: 0.72, 
      url: "#",
      snippet: "Technology companies are driving market gains following a series of better-than-expected quarterly earnings reports..."
    }
  ],
  sentimentHistory: [
    { date: "2025-02-13", sentiment: 0.42, volume: 1250 },
    { date: "2025-02-20", sentiment: 0.48, volume: 1320 },
    { date: "2025-02-27", sentiment: 0.55, volume: 1480 },
    { date: "2025-03-06", sentiment: 0.58, volume: 1520 },
    { date: "2025-03-13", sentiment: 0.65, volume: 1680 }
  ],
  wordCloud: [
    { word: "bullish", weight: 85, sentiment: 0.9 },
    { word: "growth", weight: 72, sentiment: 0.8 },
    { word: "optimistic", weight: 65, sentiment: 0.85 },
    { word: "rally", weight: 58, sentiment: 0.75 },
    { word: "recovery", weight: 52, sentiment: 0.7 },
    { word: "inflation", weight: 48, sentiment: -0.6 },
    { word: "rates", weight: 45, sentiment: -0.4 },
    { word: "earnings", weight: 42, sentiment: 0.5 },
    { word: "recession", weight: 38, sentiment: -0.8 },
    { word: "volatility", weight: 35, sentiment: -0.5 },
    { word: "opportunity", weight: 32, sentiment: 0.7 },
    { word: "risk", weight: 30, sentiment: -0.6 },
    { word: "momentum", weight: 28, sentiment: 0.6 },
    { word: "bearish", weight: 25, sentiment: -0.85 },
    { word: "correction", weight: 22, sentiment: -0.7 }
  ]
};

// Helper function to format percentage
const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value);
};

// Helper function to get sentiment color
const getSentimentColor = (sentiment: number) => {
  if (sentiment >= 0.6) return "text-green-500";
  if (sentiment >= 0.2) return "text-emerald-500";
  if (sentiment >= -0.2) return "text-blue-500";
  if (sentiment >= -0.6) return "text-amber-500";
  return "text-red-500";
};

// Helper function to get sentiment badge variant
const getSentimentBadgeVariant = (sentiment: number): "default" | "secondary" | "destructive" | "outline" => {
  if (sentiment >= 0.6) return "default";
  if (sentiment >= 0.2) return "default";
  if (sentiment >= -0.2) return "secondary";
  if (sentiment >= -0.6) return "destructive";
  return "destructive";
};

// Helper function to get sentiment label
const getSentimentLabel = (sentiment: number) => {
  if (sentiment >= 0.6) return "Very Bullish";
  if (sentiment >= 0.2) return "Bullish";
  if (sentiment >= -0.2) return "Neutral";
  if (sentiment >= -0.6) return "Bearish";
  return "Very Bearish";
};

// Helper function to get sentiment icon
const getSentimentIcon = (sentiment: number) => {
  if (sentiment >= 0.2) return <TrendingUp className="h-5 w-5" />;
  if (sentiment <= -0.2) return <TrendingDown className="h-5 w-5" />;
  return <AlertTriangle className="h-5 w-5" />;
};

const SentimentAnalysis: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState("ftse");
  const [timeframe, setTimeframe] = useState("1d");
  const [sources, setSources] = useState<string[]>(["all"]);
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Analyze market sentiment from news and social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset">Asset</Label>
            <Select defaultValue="ftse" onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ftse">FTSE 100</SelectItem>
                <SelectItem value="dax">DAX</SelectItem>
                <SelectItem value="eurusd">EUR/USD</SelectItem>
                <SelectItem value="gbpusd">GBP/USD</SelectItem>
                <SelectItem value="crude">Brent Crude</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select defaultValue="1d" onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Sources */}
          <div className="space-y-2">
            <Label>Data Sources</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={sources.includes("all") ? "default" : "outline"} 
                size="sm"
                onClick={() => setSources(["all"])}
              >
                <Globe className="h-4 w-4 mr-2" />
                All Sources
              </Button>
              <Button 
                variant={sources.includes("news") ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  if (sources.includes("news")) {
                    setSources(sources.filter(s => s !== "news"));
                  } else {
                    setSources([...sources.filter(s => s !== "all"), "news"]);
                  }
                }}
              >
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </Button>
              <Button 
                variant={sources.includes("twitter") ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  if (sources.includes("twitter")) {
                    setSources(sources.filter(s => s !== "twitter"));
                  } else {
                    setSources([...sources.filter(s => s !== "all"), "twitter"]);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                variant={sources.includes("reddit") ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  if (sources.includes("reddit")) {
                    setSources(sources.filter(s => s !== "reddit"));
                  } else {
                    setSources([...sources.filter(s => s !== "all"), "reddit"]);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Reddit
              </Button>
            </div>
          </div>

          {/* Search Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Search Keywords</Label>
            <div className="flex space-x-2">
              <Input id="keywords" placeholder="Enter keywords..." />
              <Button size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                FTSE 100
                <button className="text-muted-foreground hover:text-foreground">×</button>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                UK Market
                <button className="text-muted-foreground hover:text-foreground">×</button>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                Trading
                <button className="text-muted-foreground hover:text-foreground">×</button>
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Sentiment Data
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <div className="col-span-9 space-y-6">
        {/* Sentiment Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sentiment Overview</CardTitle>
                <CardDescription>
                  Overall market sentiment from all sources
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {/* Overall Sentiment */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Overall Sentiment</h3>
                    <Badge variant={getSentimentBadgeVariant(mockSentimentData.overallSentiment)}>
                      {getSentimentLabel(mockSentimentData.overallSentiment)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                      <div 
                        className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-transparent"
                        style={{ 
                          borderTopColor: mockSentimentData.overallSentiment > 0 ? '#22c55e' : '#ef4444',
                          borderRightColor: mockSentimentData.overallSentiment > 0 ? '#22c55e' : '#ef4444',
                          transform: `rotate(${mockSentimentData.overallSentiment * 180}deg)`,
                        }}
                      ></div>
                      <span className="text-3xl font-bold">
                        {formatPercent(mockSentimentData.overallSentiment)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trend</span>
                    <div className="flex items-center">
                      {mockSentimentData.sentimentTrend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={mockSentimentData.sentimentTrend > 0 ? "text-green-500" : "text-red-500"}>
                        {mockSentimentData.sentimentTrend > 0 ? "+" : ""}{formatPercent(mockSentimentData.sentimentTrend)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment by Source */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Sentiment by Source</h3>
                  <div className="space-y-3">
                    {Object.entries(mockSentimentData.sources).map(([source, sentiment]) => (
                      <div key={source}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{source}</span>
                          <span className={`text-sm font-medium ${getSentimentColor(sentiment)}`}>
                            {formatPercent(sentiment)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${sentiment >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                            style={{ width: `${Math.abs(sentiment) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Mentions */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Top Mentions</h3>
                  <div className="space-y-3">
                    {mockSentimentData.topMentions.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{item.entity}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.mentions}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getSentimentColor(item.sentiment)}`}>
                            {formatPercent(item.sentiment)}
                          </span>
                          <span className={`text-xs ml-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {item.change > 0 ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment History Chart Placeholder */}
            <div className="mt-8 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Sentiment History</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Sentiment history chart would be displayed here</p>
                  <p className="text-sm">In a real implementation, this would show sentiment trends over time with volume overlay</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Tabs */}
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="news">News Sentiment</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="assets">Asset Sentiment</TabsTrigger>
          </TabsList>
          
          {/* News Sentiment Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent News Analysis</CardTitle>
                <CardDescription>
                  Sentiment analysis of recent financial news
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockSentimentData.recentNews.map((news, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{news.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>{news.source}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <Badge variant={getSentimentBadgeVariant(news.sentiment)}>
                          {formatPercent(news.sentiment)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {news.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Sentiment</CardTitle>
                <CardDescription>
                  Analysis of social media discussions and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Word Cloud Placeholder */}
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4">Sentiment Word Cloud</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Sentiment word cloud would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show a word cloud with sentiment coloring</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Bullish Keywords</h3>
                    <div className="space-y-2">
                      {mockSentimentData.wordCloud
                        .filter(word => word.sentiment > 0)
                        .sort((a, b) => b.sentiment - a.sentiment)
                        .slice(0, 5)
                        .map((word, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                            <span className="font-medium">{word.word}</span>
                            <div className="flex items-center">
                              <span className="text-sm mr-2">{word.weight} mentions</span>
                              <Badge variant="default">
                                {formatPercent(word.sentiment)}
                              </Badge>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Bearish Keywords</h3>
                    <div className="space-y-2">
                      {mockSentimentData.wordCloud
                        .filter(word => word.sentiment < 0)
                        .sort((a, b) => a.sentiment - b.sentiment)
                        .slice(0, 5)
                        .map((word, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                            <span className="font-medium">{word.word}</span>
                            <div className="flex items-center">
                              <span className="text-sm mr-2">{word.weight} mentions</span>
                              <Badge variant="destructive">
                                {formatPercent(word.sentiment)}
                              </Badge>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Asset Sentiment Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset-Specific Sentiment</CardTitle>
                <CardDescription>
                  Sentiment analysis for specific assets and markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Asset</th>
                        <th className="text-center py-3 px-4">Sentiment</th>
                        <th className="text-right py-3 px-4">Mentions</th>
                        <th className="text-right py-3 px-4">Price Correlation</th>
                        <th className="text-center py-3 px-4">Signal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSentimentData.sentimentByAsset.map((asset, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.asset}</div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <div className="flex flex-col items-center">
                              <Badge variant={getSentimentBadgeVariant(asset.sentiment)}>
                                {formatPercent(asset.sentiment)}
                              </Badge>
                              <span className="text-xs text-muted-foreground mt-1">
                                {getSentimentLabel(asset.sentiment)}
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            {asset.mentions}
                          </td>
                          <td className="text-right py-3 px-4">
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{asset.priceCorrelation.toFixed(2)}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${asset.priceCorrelation * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              {getSentimentIcon(asset.sentiment)}
                              <span className="ml-1 text-sm font-medium">
                                {asset.sentiment > 0.4 ? "Buy" : 
                                 asset.sentiment < -0.4 ? "Sell" : "Neutral"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sentiment vs Price Chart Placeholder */}
                <div className="mt-8 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Sentiment vs Price Correlation</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Sentiment vs price chart would be displayed here</p>
                      <p className="text-sm">In a real implementation, this would show the correlation between sentiment and price movements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
