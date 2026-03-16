'use client';

import Container from '@/components/common/Container';
import GithubIcon from '@/components/svgs/Github';
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from '@/config/Github';
import { Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type ContributionDay = {
  count: number;
  date: string;
  level: ContributionLevel;
};

type ContributionResponse = {
  contributions: ContributionDay[];
  totalContributions: number;
};

type TooltipState = {
  left: number;
  text: string;
  top: number;
};

const GRID_COLUMNS = 52;
const GRID_ROWS = 7;
const GRID_CELL_COUNT = GRID_COLUMNS * GRID_ROWS;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const LEVEL_CLASS_MAP: Record<ContributionLevel, string> = {
  0: 'bg-[#161b22]',
  1: 'bg-[#0e4429]',
  2: 'bg-[#006d32]',
  3: 'bg-[#26a641]',
  4: 'bg-[#39d353]',
};

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
});

const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
});

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
});

function parseUTCDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toUTCDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildGraphDays(contributions: ContributionDay[]): ContributionDay[] {
  const byDate = new Map(contributions.map((day) => [day.date, day]));
  const today = new Date();
  const endUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const startUTC = new Date(endUTC);
  startUTC.setUTCDate(startUTC.getUTCDate() - (GRID_CELL_COUNT - 1));

  const days: ContributionDay[] = [];

  for (let index = 0; index < GRID_CELL_COUNT; index += 1) {
    const date = new Date(startUTC);
    date.setUTCDate(startUTC.getUTCDate() + index);
    const key = toUTCDateString(date);

    const existing = byDate.get(key);
    if (existing) {
      days.push(existing);
      continue;
    }

    days.push({
      count: 0,
      date: key,
      level: 0,
    });
  }

  return days;
}

function buildWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];

  for (let column = 0; column < GRID_COLUMNS; column += 1) {
    const start = column * GRID_ROWS;
    weeks.push(days.slice(start, start + GRID_ROWS));
  }

  return weeks;
}

function getMonthLabels(weeks: ContributionDay[][]): string[] {
  return weeks.map((week, index) => {
    const first = week[0];
    if (!first) {
      return '';
    }

    const month = parseUTCDate(first.date).getUTCMonth();

    if (index === 0) {
      return monthFormatter.format(parseUTCDate(first.date));
    }

    const previous = weeks[index - 1]?.[0];
    if (!previous) {
      return monthFormatter.format(parseUTCDate(first.date));
    }

    const previousMonth = parseUTCDate(previous.date).getUTCMonth();
    return month === previousMonth ? '' : monthFormatter.format(parseUTCDate(first.date));
  });
}

function getUpdateLabel(lastUpdatedAt: number | null, now: number): string {
  if (!lastUpdatedAt) {
    return 'Updated just now';
  }

  const minutes = Math.floor((now - lastUpdatedAt) / 60000);
  if (minutes <= 0) {
    return 'Updated just now';
  }

  return `Updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
}

function getTooltipLabel(day: ContributionDay): string {
  return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${fullDateFormatter.format(parseUTCDate(day.date))}`;
}

function calculateStats(days: ContributionDay[], totalFromApi: number) {
  const total = totalFromApi || days.reduce((sum, day) => sum + day.count, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let rollingStreak = 0;

  let pointer = days.length - 1;
  if (days[pointer]?.count === 0) {
    pointer -= 1;
  }

  while (pointer >= 0 && days[pointer].count > 0) {
    currentStreak += 1;
    pointer -= 1;
  }

  for (const day of days) {
    if (day.count > 0) {
      rollingStreak += 1;
      longestStreak = Math.max(longestStreak, rollingStreak);
    } else {
      rollingStreak = 0;
    }
  }

  const bestDay = days.reduce((best, day) => {
    if (!best || day.count > best.count) {
      return day;
    }

    return best;
  }, days[0]);

  return {
    bestDay,
    currentStreak,
    longestStreak,
    total,
  };
}

export default function Github() {
  const [data, setData] = useState<ContributionResponse | null>(null);
  const [graphDays, setGraphDays] = useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const previousLevelMapRef = useRef<Map<string, number>>(new Map());
  const changedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const weeks = useMemo(() => buildWeeks(graphDays), [graphDays]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
  const stats = useMemo(
    () => calculateStats(graphDays, data?.totalContributions ?? 0),
    [data?.totalContributions, graphDays],
  );

  const fetchData = useCallback(async (showSkeleton: boolean) => {
    if (showSkeleton) {
      setIsLoading(true);
    }

    try {
      setHasError(false);
      const response = await fetch('/api/github-contributions', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Could not fetch contributions');
      }

      const payload = (await response.json()) as ContributionResponse;
      const normalizedDays = buildGraphDays(payload.contributions ?? []);

      if (previousLevelMapRef.current.size > 0) {
        const changedDates = normalizedDays
          .filter(
            (day) =>
              previousLevelMapRef.current.has(day.date) &&
              previousLevelMapRef.current.get(day.date) !== day.level,
          )
          .map((day) => day.date);

        setChangedCells(new Set(changedDates));

        if (changedTimeoutRef.current) {
          clearTimeout(changedTimeoutRef.current);
        }

        changedTimeoutRef.current = setTimeout(() => {
          setChangedCells(new Set());
        }, 300);
      }

      previousLevelMapRef.current = new Map(
        normalizedDays.map((day) => [day.date, day.level]),
      );

      setData(payload);
      setGraphDays(normalizedDays);
      setLastUpdatedAt(Date.now());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(true);

    return () => {
      if (changedTimeoutRef.current) {
        clearTimeout(changedTimeoutRef.current);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (!hasLoadedOnce && graphDays.length > 0) {
      setHasLoadedOnce(true);
    }
  }, [graphDays.length, hasLoadedOnce]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchData(false);
    }, REFRESH_INTERVAL_MS);

    const handleFocus = () => {
      void fetchData(false);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchData]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchData(false);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [fetchData]);

  const handleCellMouseEnter = (
    event: ReactMouseEvent<HTMLDivElement>,
    day: ContributionDay,
  ) => {
    const grid = gridRef.current;
    if (!grid) {
      return;
    }

    const gridBounds = grid.getBoundingClientRect();
    const cellBounds = event.currentTarget.getBoundingClientRect();

    setTooltip({
      left: cellBounds.left - gridBounds.left + cellBounds.width / 2,
      text: getTooltipLabel(day),
      top: cellBounds.top - gridBounds.top - 8,
    });
  };

  const updateLabel = getUpdateLabel(lastUpdatedAt, now);

  return (
    <Container className="mt-16 md:mt-20">
      <section ref={sectionRef} className="w-full">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Activity</p>
          <div className="mt-1 inline-flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
              GitHub Contributions
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Live
            </span>
          </div>
          <Link
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            @{GITHUB_USERNAME}
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-8">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-base font-bold md:text-lg">---</p>
                <p className="text-xs text-muted-foreground">This year</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-base font-bold md:text-lg">--</p>
                <p className="text-xs text-muted-foreground">Current streak</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-base font-bold md:text-lg">--</p>
                <p className="text-xs text-muted-foreground">Best day</p>
              </div>
            </div>

            <div className="w-full overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] lg:overflow-visible">
              <div className="mx-auto flex w-full justify-start lg:justify-center">
                <div className="inline-flex min-w-max justify-center rounded-2xl border-2 border-border bg-card/30 p-3 sm:p-4 md:border-[2.5px] md:p-5 lg:border-[3px] lg:p-6">
                  <div className="grid grid-flow-col grid-rows-7 gap-0.75">
                    {Array.from({ length: GRID_CELL_COUNT }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="h-2.5 w-2.5 animate-pulse rounded-sm bg-muted/30 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : hasError || graphDays.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">Could not load contribution data</p>
            <button
              type="button"
              onClick={() => {
                void fetchData(true);
              }}
              className="mt-2 text-xs text-muted-foreground underline transition-colors hover:text-foreground"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-8 opacity-100 transition-opacity duration-500">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-base font-bold md:text-lg">
                  {stats.total.toLocaleString()} contributions
                </p>
                <p className="text-xs text-muted-foreground">This year</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="inline-flex items-center gap-1 text-base font-bold md:text-lg">
                  {stats.currentStreak} day streak
                  <Flame className="h-4 w-4 text-orange-400" />
                </p>
                <p className="text-xs text-muted-foreground">Current streak</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-base font-bold md:text-lg">
                  Best: {stats.bestDay?.count ?? 0} on{' '}
                  {stats.bestDay
                    ? monthDayFormatter.format(parseUTCDate(stats.bestDay.date))
                    : '--'}
                </p>
                <p className="text-xs text-muted-foreground">Best day</p>
              </div>
            </div>

            <div className="w-full overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] lg:overflow-visible">
              <div className="mx-auto flex w-full justify-start lg:justify-center">
                <div className="inline-flex min-w-max justify-center rounded-2xl border-2 border-border bg-card/30 p-3 sm:p-4 md:border-[2.5px] md:p-5 lg:border-[3px] lg:p-6">
                  <div className="flex items-start gap-2">
                    <div className="hidden w-6 flex-col pt-3.75 md:flex">
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60"> </span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60">Mon</span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60"> </span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60">Wed</span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60"> </span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60">Fri</span>
                      <span className="h-3.5 text-right pr-1 text-[10px] font-mono text-muted-foreground/60"> </span>
                    </div>

                    <div ref={gridRef} className="relative">
                      <div className="mb-0.75 grid grid-cols-52 gap-0.75">
                        {monthLabels.map((month, index) => (
                          <div
                            key={`month-${index}`}
                            className="h-3 text-[10px] font-mono text-muted-foreground/60"
                          >
                            {month}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-flow-col grid-rows-7 gap-0.75">
                        {weeks.flat().map((day, index) => {
                          const changed = changedCells.has(day.date);

                          return (
                            <motion.div
                              key={`${day.date}-${day.level}`}
                              role="presentation"
                              className={`h-2.5 w-2.5 rounded-sm transition-colors duration-300 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${LEVEL_CLASS_MAP[day.level]}`}
                              initial={
                                hasLoadedOnce
                                  ? false
                                  : {
                                      opacity: 0,
                                      scale: 0.5,
                                    }
                              }
                              animate={
                                changed
                                  ? {
                                      opacity: 1,
                                      scale: [1, 1.3, 1],
                                    }
                                  : {
                                      opacity: 1,
                                      scale: 1,
                                    }
                              }
                              transition={{
                                delay: hasLoadedOnce ? 0 : index * 0.002,
                                duration: changed ? 0.3 : 0.25,
                                ease: 'easeOut',
                              }}
                              onMouseEnter={(event) => {
                                handleCellMouseEnter(event, day);
                              }}
                              onMouseLeave={() => {
                                setTooltip(null);
                              }}
                            />
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {tooltip && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-2 py-1 text-xs shadow-lg"
                            style={{
                              left: tooltip.left,
                              top: tooltip.top,
                              transform: 'translate(-50%, -100%)',
                            }}
                          >
                            {tooltip.text}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground/50">{updateLabel}</p>
          </div>
        )}
      </section>
    </Container>
  );
}
