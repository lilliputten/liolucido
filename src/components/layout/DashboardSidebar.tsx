'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DialogTitle } from '@radix-ui/react-dialog';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';

import { TPropsWithChildren } from '@/shared/types/generic';
import { SidebarNavItem } from '@/shared/types/site/NavItem';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectSwitcher } from '@/components/dashboard/ProjectSwitcher';
import { UpgradeCard } from '@/components/dashboard/UpgradeCard';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();

  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei
  //
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = window.localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   }
  //   return true;
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.localStorage.setItem(
  //       "sidebarExpanded",
  //       JSON.stringify(isSidebarExpanded),
  //     );
  //   }
  // }, [isSidebarExpanded]);

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          isDev && '__DashboardSidebar', // DEBUG
          'bg-primary/10',
          // 'bg-[var(--primaryColor)]/50',
          // 'sticky top-0 h-full',
          // NOTE: Set sidebar atop the main content (ensure that this z-index is enough)
          // 'z-10',
        )}
      >
        <ScrollArea
          className={cn(
            isDev && '__DashboardSidebar_Scroll', // DEBUG
            'h-full overflow-y-auto border-r',
          )}
          viewportClassName={cn(
            isDev && '__DashboardSidebar_ScrollViewport', // DEBUG
            '[&>div]:h-full',
          )}
        >
          <aside
            className={cn(
              isSidebarExpanded ? 'w-[220px] xl:w-[260px]' : 'w-[68px]',
              '__h-screen hidden h-full md:block',
            )}
          >
            <div className="flex h-full flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px]">
                {isSidebarExpanded && <ProjectSwitcher />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose size={18} className="stroke-muted-foreground" />
                  ) : (
                    <PanelRightClose size={18} className="stroke-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav
                className={cn(
                  isDev && '__DashboardSidebar_Section', // DEBUG
                  'flex flex-1 flex-col gap-8 px-4 pt-4',
                )}
              >
                {links.map((section) => (
                  <section key={section.titleId} className="flex flex-col gap-0.5">
                    {isSidebarExpanded ? (
                      <p
                        className={cn(
                          isDev && '__DashboardSidebar_Section_Title', // DEBUG
                          'mb-4 text-xs uppercase text-muted-foreground',
                        )}
                      >
                        {section.titleId}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}
                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || 'arrowRight'];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.titleId}`}>
                            {isSidebarExpanded ? (
                              <Link
                                key={`link-${item.titleId}`}
                                href={item.disabled ? '#' : item.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-primary',
                                  path === item.href
                                    ? 'bg-muted'
                                    : 'text-muted-foreground hover:text-accent-foreground',
                                  item.disabled &&
                                    'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground',
                                )}
                              >
                                <Icon className="size-5" />
                                {item.titleId}
                                {item.badge && (
                                  <Badge className="flex size-5 shrink-0 items-center justify-center rounded-full">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            ) : (
                              <Tooltip key={`tooltip-${item.titleId}`}>
                                <TooltipTrigger asChild>
                                  <Link
                                    key={`link-tooltip-${item.titleId}`}
                                    href={item.disabled ? '#' : item.href}
                                    className={cn(
                                      'flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-primary',
                                      path === item.href
                                        ? 'bg-muted'
                                        : 'text-muted-foreground hover:text-accent-foreground',
                                      item.disabled &&
                                        'pointer-events-none cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground',
                                    )}
                                  >
                                    <span className="flex size-full items-center justify-center">
                                      <Icon className="size-5" />
                                    </span>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.titleId}</TooltipContent>
                              </Tooltip>
                            )}
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}
              </nav>

              <div className="mt-auto xl:p-4">{isSidebarExpanded ? <UpgradeCard /> : null}</div>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

interface TMobileSheetProps {
  open: boolean;
  setOpen: (p: boolean) => void;
}

export function MobileSheetWrapper(props: TMobileSheetProps & TPropsWithChildren) {
  const { children, open, setOpen } = props;
  // const path = usePathname();
  // const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Navigation menu</DialogTitle>
        {/*
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="size-9 shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
         */}
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto bg-primary/10">
            {/* MobileSheetSidebar */}
            {children}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }
  // return <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />;
}

export function MobileSheetSidebar(props: DashboardSidebarProps & TMobileSheetProps) {
  const { links, setOpen } = props;
  const path = usePathname();
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
          <Icons.logo className="size-6" />
          <span className="text-xl font-bold">{siteConfig.name}</span>
        </Link>

        {<ProjectSwitcher large />}

        {links.map((section) => (
          <section key={section.titleId} className="flex flex-col gap-0.5">
            <p className="mb-4 text-xs uppercase text-muted-foreground">{section.titleId}</p>

            {section.items.map((item) => {
              const Icon = Icons[item.icon || 'arrowRight'];
              return (
                item.href && (
                  <Fragment key={`link-fragment-${item.titleId}`}>
                    <Link
                      key={`link-${item.titleId}`}
                      onClick={() => {
                        if (!item.disabled) {
                          setOpen(false);
                        }
                      }}
                      href={item.disabled ? '#' : item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-primary',
                        path === item.href
                          ? 'bg-muted'
                          : 'text-muted-foreground hover:text-accent-foreground',
                        item.disabled &&
                          'pointer-events-none cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground',
                      )}
                    >
                      <Icon className="size-5" />
                      {item.titleId}
                      {item.badge && (
                        <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Fragment>
                )
              );
            })}
          </section>
        ))}

        {/* TODO: Show menu if collapsed */}

        <div className="mt-auto">
          <UpgradeCard />
        </div>
      </nav>
    </div>
  );
}
