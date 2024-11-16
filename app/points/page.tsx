'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Team } from '../types';

export default function PointsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    const data = await response.json();
    setTeams(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Select Team for Story Points</h1>
      <div className="grid gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/points/${team.id}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-bold">{team.name}</h2>
            <p className="text-gray-600">{team.members.length} members</p>
          </Link>
        ))}
      </div>
    </div>
  );
}