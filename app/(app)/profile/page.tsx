'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionShell } from '@/components/workspace/section-shell';
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
} from "@/components/ui/alert-dialog";
import { User, LogOut, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '@/lib/profile';

export default function ProfilePage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? '');
      setLastName(profile.lastName ?? '');
    }
  }, [profile, isEditing]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error(error);
    }
  });

  const handleSave = () => {
    if (!firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    updateMutation.mutate({ firstName, lastName });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'User';

  return (
    <SectionShell
      eyebrow="Account Details"
      title="Profile"
      action={
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button 
                variant="outline" 
                className="gap-2 shadow-sm rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 transition-all duration-300"
              />
            }
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl bg-background/95">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Sign out of DocuMind?</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground">
                You will need to sign back in to access your workspace and documents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    >
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-8">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <span className="text-2xl font-normal tracking-tight">
                {displayName[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-normal tracking-tight text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {profile?.email}
            </p>
          </div>
          

        </div>

        {/* Main Details Form */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-5 mb-6">
            <h3 className="text-base font-normal tracking-tight text-foreground">Personal Information</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)} 
              className={cn(
                "rounded-lg transition-all duration-300",
                isEditing ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground"
              )}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 group">
              <label className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">First Name</label>
              <Input 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing} 
                className="h-10 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20 disabled:opacity-70 disabled:bg-muted/40 transition-all duration-300" 
              />
            </div>
            <div className="flex flex-col gap-1.5 group">
              <label className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">Last Name</label>
              <Input 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing} 
                className="h-10 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20 disabled:opacity-70 disabled:bg-muted/40 transition-all duration-300" 
              />
            </div>
            <div className="flex flex-col gap-1.5 group">
              <label className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile?.email ?? ''} 
                  disabled 
                  className="pl-9 h-10 rounded-xl border-border/50 bg-background/50 disabled:opacity-70 disabled:bg-muted/40 transition-all duration-300" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 group">
              <label className="text-sm font-medium text-foreground/80 group-focus-within:text-primary transition-colors">Account Role</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile?.role ?? 'User'} 
                  disabled 
                  className="pl-9 h-10 rounded-xl border-border/50 bg-background/50 disabled:opacity-70 disabled:bg-muted/40 transition-all duration-300 capitalize" 
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end pt-5 border-t border-border/40 animate-in slide-in-from-top-2 fade-in duration-300">
              <Button 
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded-xl px-6 font-medium shadow-sm hover:shadow transition-all duration-300"
              >
                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
