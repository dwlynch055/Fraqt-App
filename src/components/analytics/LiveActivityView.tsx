import { formatDistanceToNow } from 'date-fns';
import { CreditCard, Gift, Ticket } from 'lucide-react';
import React, { useEffect } from 'react';
import { useActivityStore } from '../../stores/activityStore';

interface Activity {
  id: string;
  type: 'created' | 'used';
  passType: 'loyalty' | 'coupon' | 'ticket';
  location: string;
  timestamp: Date;
}

const MOCK_LOCATIONS = [
  'New York, Manhattan',
  'London, Westminster',
  'Tokyo, Shibuya',
  'Sydney, CBD',
  'Paris, Le Marais',
  'Berlin, Mitte',
  'Toronto, Downtown',
  'Dubai, Downtown',
];

const PASS_TYPES = ['loyalty', 'coupon', 'ticket'] as const;

function generateMockActivity(): Activity {
  return {
    id: Math.random().toString(36).substring(7),
    type: Math.random() > 0.5 ? 'created' : 'used',
    passType: PASS_TYPES[Math.floor(Math.random() * PASS_TYPES.length)],
    location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
    timestamp: new Date(),
  };
}

export function LiveActivityView() {
  const { activities, stats, addActivity } = useActivityStore();

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      addActivity(newActivity);
    }, 2000);

    return () => clearInterval(interval);
  }, [addActivity]);

  const getPassIcon = (type: Activity['passType']) => {
    switch (type) {
      case 'loyalty':
        return CreditCard;
      case 'coupon':
        return Gift;
      case 'ticket':
        return Ticket;
      default:
        return CreditCard;
    }
  };

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-black">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Global Activity</h2>
            <p className="mt-1 text-[13px] text-gray-400">Live event stream</p>
          </div>
        </div>

        <div className="max-h-[400px] space-y-0.5 overflow-y-auto rounded-lg bg-black p-3 font-mono text-sm">
          {activities.map((activity) => {
            const Icon = getPassIcon(activity.passType);
            return (
              <div
                key={activity.id}
                className="group flex items-center space-x-3 rounded px-2 py-1.5 transition-colors hover:bg-black/30"
              >
                <span
                  className={`${
                    activity.type === 'created' ? 'text-green-400' : 'text-blue-400'
                  } font-bold`}
                >
                  {activity.type === 'created' ? '+ ' : '→ '}
                </span>
                <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-300" />
                <span className="text-gray-300 transition-colors group-hover:text-white">
                  {activity.passType}
                </span>
                <span className="text-gray-500 transition-colors group-hover:text-gray-400">
                  {activity.location}
                </span>
                <span className="ml-auto text-gray-600 transition-colors group-hover:text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            );
          })}
          <div className="flex h-6 items-center px-2 text-gray-600">
            <span className="animate-pulse">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}
