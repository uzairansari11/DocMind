'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sendMessageStream, type Message } from '@/lib/chats';
import { useChats, useChatDetails } from '@/hooks/use-chats';
import { cn } from '@/lib/utils';
import { Loader2, Send, Bot, Sparkles, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect, use } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  ssr: false, 
  loading: () => <div className="animate-pulse bg-muted/50 w-full h-10 rounded-md" /> 
});
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

function MessageItem({ message, isPending }: { message: Message; isPending: boolean }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        'flex w-full group flex-col',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'flex gap-3 sm:gap-4 text-sm',
          message.role === 'user'
            ? 'bg-primary/90 text-primary-foreground rounded-2xl rounded-tr-sm px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg shadow-primary/20 backdrop-blur-md max-w-[85%] sm:max-w-[75%]'
            : 'w-full max-w-4xl bg-card/60 rounded-2xl rounded-tl-sm px-4 sm:px-5 py-3 shadow-sm border border-border/50 backdrop-blur-md'
        )}
      >
        {message.role === 'assistant' && (
          <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-inner mt-0.5">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {message.content === '' && message.role === 'assistant' && isPending ? (
            <div className="flex items-center gap-1 h-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : message.role === 'assistant' ? (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          )}
        </div>
      </div>
      
      {/* Action Bar (Copy) */}
      {message.content && (
        <div className={cn(
          "flex items-center opacity-0 group-hover:opacity-100 transition-opacity mt-1.5",
          message.role === 'user' ? 'pr-2' : 'pl-14'
        )}>
          <button
            onClick={() => copyToClipboard(message.content)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 text-[11px] font-medium transition-colors"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {isCopied ? <span className="text-green-500">Copied</span> : <span>Copy</span>}
          </button>
        </div>
      )}
    </motion.div>
  );
}



export default function ChatSessionPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  
  const { data: pastChats = [] } = useChats();
  
  const chatContext = pastChats.find((c) => c.id === chatId);

  const { data: chatDetails, isLoading: isLoadingDetails } = useChatDetails(chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(false);
    setMessages([]);
  }, [chatId]);
  
  useEffect(() => {
    if (chatDetails && !isInitialized) {
      if (chatDetails.messages && chatDetails.messages.length > 0) {
        setMessages(chatDetails.messages);
      } else {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: `Loaded chat: **${chatDetails.title || chatContext?.title || 'Untitled'}**. You can continue asking questions.`,
          }
        ]);
      }
      setIsInitialized(true);
    }
  }, [chatDetails, isInitialized, chatContext?.title, chatId]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!chatId) return;

    setIsPending(true);
    const tempId = crypto.randomUUID();
    
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: 'assistant', content: '' },
    ]);

    try {
      await sendMessageStream(chatId, content, {
        onToken: (token) => {
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === tempId ? { ...msg, content: msg.content + token } : msg
            )
          );
        },
        onSources: (sources) => {
          // Can handle sources later
        },
        onDone: () => {
          setIsPending(false);
        },
        onError: (message) => {
          toast.error(message);
          setIsPending(false);
        }
      });
    } catch (error) {
      toast.error('Failed to send message');
      setMessages((prev) => prev.filter(msg => msg.id !== tempId));
      setIsPending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    sendMessage(userMsg.content);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background relative">
      <div className="flex h-16 shrink-0 items-center gap-2 px-4 sm:pr-6 sm:pl-4 md:pl-14 border-b border-border/40 bg-background/50">
         <Sparkles className="h-5 w-5 text-primary shrink-0" />
         <h2 className="font-normal text-sm text-foreground tracking-tight truncate">
           {chatDetails?.title || chatContext?.title || 'Loading Chat...'}
         </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth space-y-6 flex flex-col pb-32 lg:pb-32 relative">
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
        
        {isLoadingDetails && !isInitialized ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} isPending={isPending} />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-[calc(env(safe-area-inset-bottom)+4.5rem)] lg:pb-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto w-full relative pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-3 relative shadow-xl shadow-black/5 dark:shadow-black/20 rounded-full"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your knowledge base..."
              className="flex-1 h-14 rounded-full pl-6 pr-14 border-border/50 bg-background/60 backdrop-blur-xl focus-visible:ring-primary text-base"
              disabled={isPending || isLoadingDetails}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isPending || isLoadingDetails}
              className="absolute right-2 h-10 w-10 rounded-full shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-[10px] text-muted-foreground/80 font-medium uppercase tracking-widest backdrop-blur-sm px-2 py-0.5 rounded-full inline-block">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
