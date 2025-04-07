import { Suspense, use } from 'react';
import type { extractWakaTimeStats } from '../libs/extractWakaTimeStats';
import { WakatimeStatsSkeleton } from './skeletons/WakatimeStatsSkeleton';
import { parseWakatimeStats } from '../libs/parseWakatimeStats';
import clsx from 'clsx';

export function WakatimeStats() {
  const stats = use(
    fetch('http://localhost:4321/api/wakastats').then(
      (res) =>
        res.json() as Promise<
          NonNullable<ReturnType<typeof extractWakaTimeStats>>
        >,
    ),
  );
  const prolang = parseWakatimeStats(stats.prolang).reduce<{
    name: string[];
    timeString: string[];
    bar: string[];
    percentageString: string[];
  }>(
    (acc, v) => {
      acc.name.push(v.name);
      acc.bar.push(v.bar);
      acc.timeString.push(v.timeString);
      acc.percentageString.push(v.percentageString);

      return acc;
    },
    { name: [], timeString: [], bar: [], percentageString: [] },
  );

  return (
    <div className="text-sm font-serif">
      <div className="flex items-center justify-between">
        {Object.entries(prolang).map(([key, stats]) => (
          <div key={key} className="flex flex-col">
            {stats.map((value) => (
              <span
                key={value}
                className={clsx(key === 'bar' && 'font-mono hidden sm:inline')}
              >
                {value} {key === 'percentageString' && '%'}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <Suspense fallback={<WakatimeStatsSkeleton />}>
      <h2 className="title">This Week I Spent My Time On</h2>
      <WakatimeStats />
    </Suspense>
  );
}
