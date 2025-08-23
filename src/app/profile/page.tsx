'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
           <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
              <AvatarFallback className="text-3xl">
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.displayName || 'No display name set'}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
