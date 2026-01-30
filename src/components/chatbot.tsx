'use client';

import { useState, useRef, useEffect } from 'react';
import { continueChat } from '@/app/dashboard/_components/chat-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, LoaderCircle, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // The timeout allows React to render the new message before we scroll
    setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }, 100);
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    // We scroll immediately for the user's message
    scrollToBottom();

    try {
      const response = await continueChat(newMessages);
      const modelMessage: Message = { role: 'model', content: response };
      setMessages([...newMessages, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // And scroll again for the model's response
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm h-[70vh] flex flex-col shadow-2xl z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot size={20}/>
                </Avatar>
                <CardTitle className="text-lg">AI Helper</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot size={20}/>
                    </Avatar>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                        <p>Hello! I'm your AI helper. How can I assist you with your studies today?</p>
                    </div>
                </div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                       message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                          <Bot size={20}/>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                         <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                            <Bot size={20}/>
                        </Avatar>
                         <div className="rounded-lg bg-muted p-3">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                autoFocus
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
