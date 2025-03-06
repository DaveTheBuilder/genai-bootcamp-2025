import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from '../../lib/api';
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Transcriber() {
    const [videoUrl, setVideoUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [processedVideos, setProcessedVideos] = useState<string[]>([]);
    const { toast } = useToast();

    const processVideo = async () => {
        if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
            toast({
                title: "Invalid URL",
                description: "Please enter a valid YouTube URL",
                variant: "destructive"
            });
            return;
        }

        setIsProcessing(true);
        try {
            await api.youtube.processVideo(videoUrl);
            
            toast({
                title: "Success",
                description: "Video processed successfully!",
            });
            setProcessedVideos(prev => [...prev, videoUrl]);
            setVideoUrl('');
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to process video',
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const searchContent = async () => {
        if (!searchQuery.trim()) {
            toast({
                title: "Invalid Query",
                description: "Please enter a search query",
                variant: "destructive"
            });
            return;
        }

        setIsSearching(true);
        try {
            const data = await api.youtube.searchContent(searchQuery);
            setResults(data.results);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to search content',
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Spanish Video Transcriber</h1>
            
            {/* Video Processing Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Process Spanish YouTube Video</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter Spanish YouTube URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1"
                        />
                        <Button 
                            onClick={processVideo}
                            disabled={isProcessing || !videoUrl}
                            className="min-w-[120px]"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </>
                            ) : "Process"}
                        </Button>
                    </div>

                    {/* Processed Videos */}
                    {processedVideos.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Processed Videos:</h3>
                            <div className="flex flex-wrap gap-2">
                                {processedVideos.map((url, index) => (
                                    <Badge key={index} variant="secondary">
                                        {url.substring(0, 40)}...
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter search query in Spanish"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button 
                            onClick={searchContent}
                            disabled={isSearching || !searchQuery || processedVideos.length === 0}
                            className="min-w-[120px]"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching
                                </>
                            ) : "Search"}
                        </Button>
                    </div>

                    {/* Search Results */}
                    {results.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-semibold">Search Results</h3>
                            {results.map((result, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <p className="text-sm">{result}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* No Videos Processed Message */}
                    {processedVideos.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-4">
                            Process some Spanish YouTube videos first to enable content search.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
