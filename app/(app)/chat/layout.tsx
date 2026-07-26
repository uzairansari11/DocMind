'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChats, useCreateChat, useUpdateChat, useDeleteChat } from '@/hooks/use-chats';
import { useCollections } from '@/hooks/use-collections';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, MessageSquare, Pin, PinOff, Edit2, Check, X, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { NewChatModal } from '@/components/chat/new-chat-modal';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

function ChatListItem({ 
  chat, 
  currentChatId, 
  onCloseMobile,
  onTogglePin,
  onRename,
  onDelete 
}: { 
  chat: any, 
  currentChatId?: string,
  onCloseMobile: () => void,
  onTogglePin: (id: string, isPinned: boolean) => void,
  onRename: (id: string, title: string) => void,
  onDelete: (id: string) => void,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title || '');

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(chat.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(chat.title || '');
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative group w-full flex items-center"
    >
      <Link
        href={`/chat/${chat.id}`}
        onClick={() => onCloseMobile()}
        className={cn(
          "flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 text-left overflow-hidden pr-16",
          currentChatId === chat.id 
            ? "bg-primary/10 text-primary font-medium shadow-sm backdrop-blur-md border border-primary/20" 
            : "text-muted-foreground hover:bg-muted/80 hover:backdrop-blur-sm hover:text-foreground border border-transparent"
        )}
      >
        <MessageSquare className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          currentChatId === chat.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
            <input 
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full bg-background border border-input rounded-sm px-1.5 py-0.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave(e as any);
                if (e.key === 'Escape') handleCancel(e as any);
              }}
            />
          </div>
        ) : (
          <span className="truncate flex-1 min-w-0">{chat.title || 'Untitled Chat'}</span>
        )}
      </Link>
      
      {/* Actions */}
      <div className={cn(
        "absolute right-2 flex items-center gap-0.5",
        isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-1 rounded-md hover:bg-background/80 text-green-600">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button onClick={handleCancel} className="p-1 rounded-md hover:bg-background/80 text-red-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); }} 
              className="p-1.5 rounded-md hover:bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(chat.id, !!chat.isPinned); }} 
              className="p-1.5 rounded-md hover:bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground"
            >
              {chat.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteDialog(true); }} 
              className="p-1.5 rounded-md hover:bg-red-500/10 backdrop-blur-sm text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent onClick={e => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the chat history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(false); }}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(false);
                      onDelete(chat.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const currentChatId = params.chatId as string | undefined;
  const queryClient = useQueryClient();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: collections = [] } = useCollections();
  const allDocuments = collections.flatMap(c => c.documents || []);

  const { data: pastChats = [], isLoading: isLoadingChats } = useChats();
  const { mutate: createChat } = useCreateChat();
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  const startNewChat = () => {
    setIsNewChatModalOpen(true);
    setIsMobileOpen(false);
  };

  const handleCreateChat = async (title: string, documentIds: string[]) => {
    createChat({ title, documentIds }, {
      onSuccess: (chat) => {
        router.push(`/chat/${chat.id}`);
        toast.success('Chat created');
      }
    });
  };

  const handleTogglePin = async (chatId: string, currentPinStatus: boolean) => {
    updateChat({ chatId, payload: { isPinned: !currentPinStatus } }, {
      onSuccess: () => {
        toast.success(currentPinStatus ? 'Chat unpinned' : 'Chat pinned');
      }
    });
  };

  const handleRename = async (chatId: string, newTitle: string) => {
    updateChat({ chatId, payload: { title: newTitle } }, {
      onSuccess: () => {
        toast.success('Chat renamed');
      }
    });
  };

  const handleChatDelete = async (chatId: string) => {
    deleteChat(chatId, {
      onSuccess: () => {
        toast.success('Chat deleted');
        if (currentChatId === chatId) {
          router.push('/chat');
        }
      }
    });
  };

  const pinnedChats = pastChats.filter((c) => c.isPinned);
  const recentChats = pastChats.filter((c) => !c.isPinned);

  const SidebarContent = (
    <>
      <div className="flex h-16 shrink-0 items-center px-5 border-b border-border/40 bg-muted/10">
        <Button onClick={startNewChat} className="w-full gap-2 shadow-sm rounded-xl h-10 font-medium">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoadingChats ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : pastChats.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center p-4 italic">No previous chats</div>
        ) : (
          <div className="space-y-4">
            {pinnedChats.length > 0 && (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-[11px] font-normal text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-2 flex items-center gap-1.5">
                  <Pin className="h-3 w-3" /> Pinned
                </h3>
                <motion.div layout className="space-y-1">
                  <AnimatePresence>
                    {pinnedChats.map((chat) => (
                      <ChatListItem 
                        key={chat.id} 
                        chat={chat} 
                        currentChatId={currentChatId} 
                        onCloseMobile={() => setIsMobileOpen(false)}
                        onTogglePin={handleTogglePin}
                        onRename={handleRename}
                        onDelete={handleChatDelete}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
            
            {recentChats.length > 0 && (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-[11px] font-normal text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-2">
                  Recent Chats
                </h3>
                <motion.div layout className="space-y-1">
                  <AnimatePresence>
                    {recentChats.map((chat) => (
                      <ChatListItem 
                        key={chat.id} 
                        chat={chat} 
                        currentChatId={currentChatId} 
                        onCloseMobile={() => setIsMobileOpen(false)}
                        onTogglePin={handleTogglePin}
                        onRename={handleRename}
                        onDelete={handleChatDelete}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative bg-background">
      {/* Desktop Sidebar */}
      {isSidebarOpen && (
        <div className="hidden md:flex w-[280px] shrink-0 flex-col overflow-hidden border-r border-border/40 bg-card/30 transition-all duration-300 h-full">
          {SidebarContent}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-full min-w-0">
        {/* Toggle Sidebar Button (Desktop) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-10 hidden md:flex h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
        >
          {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>

        {/* Mobile Sidebar Toggle */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2.5 left-4 z-10 md:hidden h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
            />
          }>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
            <span className="sr-only">Open Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] flex flex-col">
            <SheetHeader className="sr-only">
               <SheetTitle>Recent Chats</SheetTitle>
            </SheetHeader>
            {SidebarContent}
          </SheetContent>
        </Sheet>

        {children}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}
