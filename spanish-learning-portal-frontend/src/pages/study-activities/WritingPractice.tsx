import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Word } from '../../lib/types';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createScheduler, createWorker } from 'tesseract.js';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

const WritingPractice: React.FC = () => {
    const [spanishWord, setSpanishWord] = useState<string>('');
    const [englishWord, setEnglishWord] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<keyof Word>('spanish');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [manualAnswer, setManualAnswer] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState<string>('');
    const [ocrText, setOcrText] = useState<string>('');
    const { toast } = useToast();

    useEffect(() => {
        fetchWord();
    }, []);

    const fetchWord = async () => {
        try {
            const response = await api.words.list(currentPage, sortKey, sortDirection);
            console.log('API Response:', response);

            if (!response || !response.results) {
                toast({ 
                    title: 'API Error', 
                    description: 'No response received from the server', 
                    variant: 'destructive' 
                });
                return;
            }

            const words = response.results;
            
            if (!Array.isArray(words)) {
                console.error('Unexpected response format:', words);
                toast({ 
                    title: 'Data Error', 
                    description: 'Received unexpected data format from server', 
                    variant: 'destructive' 
                });
                return;
            }

            if (words.length === 0) {
                toast({ 
                    title: 'No Words Available', 
                    description: 'No words found in the database. Please add some words first.', 
                    variant: 'destructive' 
                });
                return;
            }

            const randomWord = words[Math.floor(Math.random() * words.length)];
            
            if (!randomWord || typeof randomWord !== 'object' || !('spanish' in randomWord) || !('english' in randomWord)) {
                console.error('Invalid word format:', randomWord);
                toast({ 
                    title: 'Data Error', 
                    description: 'Word data is not in the expected format', 
                    variant: 'destructive' 
                });
                return;
            }

            setSpanishWord(randomWord.spanish);
            setEnglishWord(randomWord.english);
            setResult('');
            setManualAnswer('');
            setImage(null);
            setImagePreview('');
            setOcrText('');
        } catch (error) {
            console.error('Error fetching word:', error);
            toast({ 
                title: 'Error', 
                description: error instanceof Error ? error.message : 'Failed to fetch word. Please ensure the backend server is running.', 
                variant: 'destructive' 
            });
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                    setOcrText('');
                    setOcrProgress('');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview('');
        setOcrText('');
        setOcrProgress('');
    };

    const performOCR = async (file: File): Promise<string> => {
        let worker: any = null;
        try {
            setOcrProgress('Initializing OCR...');
            
            // Convert File to base64
            const base64Image = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            // Initialize worker with logging
            worker = await createWorker({
                logger: m => {
                    console.log('Tesseract Log:', m);
                    if (m.status === 'recognizing text') {
                        setOcrProgress(`Processing: ${Math.floor(m.progress * 100)}%`);
                    }
                }
            });

            setOcrProgress('Loading language data...');
            await worker.loadLanguage('eng+spa');
            
            setOcrProgress('Initializing...');
            await worker.initialize('eng+spa');

            setOcrProgress('Processing image...');
            const { data } = await worker.recognize(base64Image);
            
            setOcrProgress('Complete!');
            const cleanedText = data.text.trim().toLowerCase();
            setOcrText(cleanedText);
            
            if (worker) {
                await worker.terminate();
            }
            
            return cleanedText;
        } catch (error) {
            console.error('OCR Error:', error);
            setOcrProgress('Error processing image');
            if (worker) {
                try {
                    await worker.terminate();
                } catch (e) {
                    console.error('Error terminating worker:', e);
                }
            }
            throw new Error('OCR processing failed: ' + (error instanceof Error ? error.message : String(error)));
        }
    };

    const checkAnswer = (userAnswer: string): boolean => {
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = spanishWord.trim().toLowerCase();
        return normalizedUserAnswer === normalizedCorrectAnswer;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (image) {
                const recognizedText = await performOCR(image);
                const isCorrect = checkAnswer(recognizedText);
                setResult(isCorrect 
                    ? '¡Correcto! (Correct!)' 
                    : `Incorrect. The OCR detected: "${recognizedText}". The correct word is: ${spanishWord}`);
            } else if (manualAnswer) {
                const isCorrect = checkAnswer(manualAnswer);
                setResult(isCorrect 
                    ? '¡Correcto! (Correct!)' 
                    : `Incorrect. The correct word is: ${spanishWord}`);
            } else {
                toast({ 
                    title: 'Input Required', 
                    description: 'Please either upload an image or type your answer.', 
                    variant: 'destructive' 
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({ 
                title: 'Error', 
                description: error instanceof Error ? error.message : 'Failed to process the answer. Please try again.', 
                variant: 'destructive' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Spanish Writing Practice</h1>
                
                <div className="mb-8 text-center">
                    <h2 className="text-xl mb-2">Translate to Spanish:</h2>
                    <p className="text-2xl font-bold text-primary">{englishWord}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Type your answer:</h3>
                        <Input
                            type="text"
                            value={manualAnswer}
                            onChange={(e) => setManualAnswer(e.target.value)}
                            placeholder="Type the Spanish translation..."
                            className="w-full"
                        />
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Or upload a photo of your written answer:</h3>
                        <div className="flex items-center gap-4">
                            <label className="flex-1">
                                <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <div className="flex flex-col items-center space-y-2">
                                        <ImageIcon className="w-6 h-6 text-gray-600" />
                                        <span className="text-sm text-gray-600">
                                            Click to upload image
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </div>

                        {imagePreview && (
                            <div className="mt-4 relative">
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-auto rounded-lg border border-gray-200"
                                    />
                                    <button
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* OCR Status and Preview */}
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">OCR Preview</h4>
                                        {ocrProgress && (
                                            <span className="text-sm text-gray-600">
                                                {ocrProgress}
                                            </span>
                                        )}
                                    </div>
                                    {ocrText && (
                                        <div className="p-2 bg-white rounded border border-gray-200">
                                            <p className="font-mono">{ocrText}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isLoading}
                            className="w-32"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Check'}
                        </Button>
                        <Button 
                            onClick={fetchWord}
                            variant="outline"
                            disabled={isLoading}
                            className="w-32"
                        >
                            Next Word
                        </Button>
                    </div>

                    {result && (
                        <div className={`mt-4 p-4 rounded-lg text-center ${
                            result.includes('Correct') 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {result}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default WritingPractice;