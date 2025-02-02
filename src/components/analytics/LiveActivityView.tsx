import React, { useEffect } from 'react';
import { CreditCard, Gift, Ticket, Plus, Check } from 'lucide-react';
import { useActivityStore } from '../../stores/activityStore';
import { formatDistanceToNow } from 'date-fns';

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
  'Dubai, Downtown'
];

const PASS_TYPES = ['loyalty', 'coupon', 'ticket'] as const;

function generateMockActivity(): Activity {
  return {
    id: Math.random().toString(36).substring(7),
    type: Math.random() > 0.5 ? 'created' : 'used',
    passType: PASS_TYPES[Math.floor(Math.random() * PASS_TYPES.length)],
    location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
    timestamp: new Date()
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
    <div className="rounded-lg overflow-hidden bg-black border border-gray-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Global Activity</h2>
            <p className="text-[13px] text-gray-400 mt-1">Live event stream</p>
          </div>
        </div>

        <div className="font-mono text-sm space-y-0.5 bg-black rounded-lg p-3 max-h-[400px] overflow-y-auto">
          {activities.map((activity) => {
            const Icon = getPassIcon(activity.passType);
            return (
              <div
                key={activity.id}
                className="flex items-center space-x-3 py-1.5 px-2 hover:bg-black/30 rounded group transition-colors"
              >
                <span className={`${
                  activity.type === 'created' ? 'text-green-400' : 'text-blue-400'
                } font-bold`}>
                  {activity.type === 'created' ? '+ ' : '→ '} 
                </span>
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {activity.passType}
                </span>
                <span className="text-gray-500 group-hover:text-gray-400 transition-colors">
                  {activity.location}
                </span>
                <span className="ml-auto text-gray-600 group-hover:text-gray-500 transition-colors">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            );
          })}
          <div className="h-6 flex items-center px-2 text-gray-600">
            <span className="animate-pulse">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}