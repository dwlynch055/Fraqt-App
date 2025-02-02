import React from 'react';
import { Icons } from '../../icons';
import { useState } from 'react';
import { InviteMemberModal } from './InviteMemberModal';
import { useDatabase } from '../../../hooks/useDatabase';
import { useAuth } from '../../../hooks/useAuth';

import { useTeam } from '../../../hooks/useTeam';

export function MembersSection() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { inviteMember } = useDatabase();
  const { user } = useAuth();
  const { members, invitations, loading } = useTeam(user?.id);

  const handleInvite = async (email: string, role: string) => {
    if (!user) return;
    await inviteMember(user.id, email, role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Team Members</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Invite member
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <Icons.Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
            <p className="text-gray-400 mt-2">Loading team members...</p>
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="pb-3 text-sm font-medium text-gray-400">Name</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Email</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Role</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Joined</th>
              <th className="pb-3 text-sm font-medium text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-800">
                <td className="py-4 text-white">{member.user.email.split('@')[0]}</td>
                <td className="py-4 text-gray-400">{member.user.email}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.role === 'owner' ? 'bg-blue-900 text-blue-200' : 'bg-gray-900 text-gray-200'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    <span className="text-gray-400">Active</span>
                  </span>
                </td>
                <td className="py-4 text-gray-400">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                    <Icons.MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {invitations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Pending Invitations</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Email</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Role</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Expires</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="border-b border-gray-800">
                    <td className="py-4 text-white">{invitation.email}</td>
                    <td className="py-4 text-gray-400">{invitation.role}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                        {invitation.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}