import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from '@/lib/config';

export default function YoutubeSearch() {
    const [videoUrl, setVideoUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { toast } = useToast();

    const processVideo = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/process-youtube-video/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video_url: videoUrl })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to process video');
            }

            toast({
                title: "Success",
                description: "Video processed successfully!",
            });
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
        setIsSearching(true);
        try {
            const response = await fetch(`${API_URL}/search-similar-content/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to search content');
            }

            const data = await response.json();
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
            <h1 className="text-2xl font-bold mb-4">YouTube Content Search</h1>
            
            {/* Video Processing Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Process YouTube Video</h2>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter YouTube URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        <Button 
                            onClick={processVideo}
                            disabled={isProcessing || !videoUrl}
                        >
                            {isProcessing ? "Processing..." : "Process Video"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content Search Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Search Content</h2>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter search query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                            onClick={searchContent}
                            disabled={isSearching || !searchQuery}
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </div>

                    {/* Results Section */}
                    {results.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                            <div className="space-y-4">
                                {results.map((result, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-4">
                                            <p>{result}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
