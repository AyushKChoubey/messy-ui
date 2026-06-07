'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { LinkPreview } from '@/components/ui/link-preview';

interface RichTextLinksProps {
  children: string;
  className?: string;
}

const WIKI_LINK_PATTERN =
  /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\(([^)]+)\)/g;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveWikiHref(target: string) {
  const trimmedTarget = target.trim();

  if (
    trimmedTarget.startsWith('/') ||
    trimmedTarget.startsWith('#') ||
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedTarget)
  ) {
    return trimmedTarget;
  }

  return `/components/${slugify(trimmedTarget)}`;
}

function renderLink(href: string, label: string, key: string) {
  const isInternal =
    href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#');

  const linkClassName = 'text-primary underline underline-offset-4';

  // Use LinkPreview for external http/https links to show a hover preview.
  const isExternalHttp = /^https?:\/\//i.test(href);

  if (isExternalHttp) {
    return (
      <LinkPreview key={key} url={href} className={linkClassName}>
        {label}
      </LinkPreview>
    );
  }

  if (isInternal) {
    return (
      <Link key={key} href={href} className={linkClassName}>
        {label}
      </Link>
    );
  }

  return (
    <a
      key={key}
      href={href}
      className={linkClassName}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

export default function RichTextLinks({
  children,
  className,
}: RichTextLinksProps) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of children.matchAll(WIKI_LINK_PATTERN)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(children.slice(lastIndex, index));
    }

    if (match[1] && match[1].length > 0) {
      const target = match[1].trim();
      const label = (match[2] ?? target).trim();
      parts.push(renderLink(resolveWikiHref(target), label, `${index}-wiki`));
    } else if (match[3] && match[4]) {
      parts.push(renderLink(match[4].trim(), match[3].trim(), `${index}-md`));
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
