'use client';

import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
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

function RedditIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 20.94c1.5 0 2.5-1 2.5-2.5V12h-5v6.44c0 1.5 1 2.5 2.5 2.5z" />
      <path d="M12 20.94c-1.5 0-2.5-1-2.5-2.5V12h5v6.44c0 1.5-1 2.5-2.5 2.5z" />
      <path d="M12 12H7.5a4.5 4.5 0 1 0 0-9h9a4.5 4.5 0 1 0 0 9H12z" />
      <path d="M16 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="m11.5 6.5.5 5" />
      <path d="m14.5 6.5-.5 5" />
    </svg>
  );
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${encodeURIComponent(
      recipe.recipeName
    )}&summary=${encodedShareText}`,
    reddit: `https://www.reddit.com/submit?url=${pageUrl}&title=${encodeURIComponent(
      recipe.recipeName
    )}`,
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
            <Twitter className="mr-2" />
            Twitter
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
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="mr-2" />
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={socialLinks.reddit} target="_blank" rel="noopener noreferrer">
            <RedditIcon className="mr-2" />
            Reddit
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
