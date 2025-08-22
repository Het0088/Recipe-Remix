
'use client';

import {
  Share2,
  X,
  Facebook,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { useToast } from '@/hooks/use-toast';

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M18.413 5.587A10.018 10.018 0 0 0 12.001 2C6.478 2 2.001 6.477 2.001 12c0 1.756.456 3.416 1.258 4.873L2 22l5.127-1.257A9.957 9.957 0 0 0 12.001 22c5.522 0 10-4.477 10-10a9.986 9.986 0 0 0-3.588-7.413zM12.001 20.133a8.12 8.12 0 0 1-4.22-1.192l-.3-.178-3.132.767.78-3.054.192-.31a8.136 8.136 0 0 1-1.29-4.398c0-4.49 3.64-8.13 8.13-8.13a8.13 8.13 0 0 1 8.13 8.13c0 4.49-3.64 8.13-8.13 8.13zm4.49-5.893c-.246-.123-1.453-.717-1.68-.8a.562.562 0 0 0-.616.082c-.22.246-.85.99-.99 1.18c-.15.2-.3.22-.54.1l-2.16-1.32c-.52-.32-.87-.72-1.02-1-.15-.27-.01-.42.1-.54.1-.12.24-.3.36-.45.1-.12.18-.2.24-.33.07-.12.04-.24 0-.36-.04-.12-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.45h-.5c-.25 0-.6.1-.9.5s-1.15 1.1-1.15 2.7c0 1.6 1.18 3.1 1.33 3.3.15.2 2.3 3.5 5.5 4.9.75.3 1.35.5 1.8.6.8.2 1.5.15 2.05-.1.6-.25 1.45-1.2 1.65-1.45s.2-.25.15-.4z"
        clipRule="evenodd"
        className="text-background"
      ></path>
    </svg>
  );
}

export function SocialShare({ recipe }: { recipe: GenerateRecipeOutput }) {
  const { toast } = useToast();
  const shareText = `Check out this recipe I generated with AI: ${
    recipe.recipeName
  }! Ingredients: ${recipe.ingredients.join(
    ', '
  )}. Instructions: ${recipe.instructions.substring(0, 100)}...`;
  const encodedShareText = encodeURIComponent(shareText);
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${pageUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedShareText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedShareText} ${pageUrl}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: 'Link Copied!', description: 'The page URL has been copied to your clipboard.' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon className="mr-2" />
            X (Twitter)
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="mr-2" />
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-action="share/whatsapp/share"
          >
            <WhatsappIcon className="mr-2" />
            WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
