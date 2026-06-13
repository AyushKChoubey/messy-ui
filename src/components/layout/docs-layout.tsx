'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';

interface DocsLayoutProps {
  children: React.ReactNode;
}

const DocsLayout = ({ children }: DocsLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/preview')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main
        className="min-h-[calc(100vh-3.5rem)]"
        style={{
          backgroundImage: `
    repeating-linear-gradient(
      22.5deg,
      transparent,
      transparent 2px,
      oklch(from var(--foreground) l c h / 0.06) 2px,
      oklch(from var(--foreground) l c h / 0.06) 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      67.5deg,
      transparent,
      transparent 2px,
      oklch(from var(--foreground) l c h / 0.05) 2px,
      oklch(from var(--foreground) l c h / 0.05) 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      112.5deg,
      transparent,
      transparent 2px,
      oklch(from var(--foreground) l c h / 0.04) 2px,
      oklch(from var(--foreground) l c h / 0.04) 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      157.5deg,
      transparent,
      transparent 2px,
      oklch(from var(--foreground) l c h / 0.03) 2px,
      oklch(from var(--foreground) l c h / 0.03) 3px,
      transparent 3px,
      transparent 8px
    )
  `,
        }}
      >
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DocsLayout;
