'use client';

import { useState, useEffect } from 'react';
import { Team } from '../types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    const data = await response.json();
    setTeams(data);
  };

  const createTeam = async () => {
    if (!newTeamName) return;
    const team: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      members: [],  
    };
    await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    setNewTeamName('');
    fetchTeams();
  };

  const deleteTeam = async (teamId: string) => {
    await fetch('/api/teams', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId }),
    });
    fetchTeams();
  };

  const addMember = async () => {
    if (!selectedTeam || !newMemberName) return;
    const updatedTeam = {
      ...selectedTeam,
      members: [
        ...selectedTeam.members,
        {
          id: Date.now().toString(),
          name: newMemberName,
          isAdmin: selectedTeam.members.length === 0, // First member is admin
        },
      ],
    };
    await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTeam),
    });
    setNewMemberName('');
    fetchTeams();
  };

  const removeMember = async (teamId: string, memberId: number) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    const updatedTeam = {
      ...team,
      members: team.members.filter((m) => m.id !== memberId),
    };
    await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTeam),
    });
    fetchTeams();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Scrum Teams</h1>
      
      <div className="mb-8">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="New team name"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={createTeam}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{team.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTeam(team.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {team.members.length} members
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedTeam && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Team Members: {selectedTeam.name}
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="New member name"
                className="border p-2 mr-2 rounded"
              />
              <button
                onClick={addMember}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Member
              </button>
            </div>
            <div className="space-y-2">
              {selectedTeam.members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>
                    {member.name} {member.isAdmin && '(Admin)'}
                  </span>
                  <button
                    onClick={() => removeMember(selectedTeam.id, member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}