'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Team, StoryPoint, StoryPointsState } from '../../types';

const POINT_OPTIONS = [1, 2, 3, 5, 8, 13, 21];

export default function StoryPointsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [storyPoints, setStoryPoints] = useState<StoryPointsState>({
    revealed: false,
    points: [],
  });
  const [selectedMembers, setSelectedMembers] = useState<number[]>([-1]);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    fetchData();
    setupSSE();
    
    return () => {
      // Cleanup SSE connection on unmount
      if (window.storyPointsSSE) {
        window.storyPointsSSE.close();
      }
    };
  }, [teamId]);

  const fetchData = async () => {
    const [teamsResponse, pointsResponse] = await Promise.all([
      fetch('/api/teams'),
      fetch('/api/story-points'),
    ]);
    
    const teams = await teamsResponse.json();
    const points = await pointsResponse.json();
    
    setTeam(teams.find((t: Team) => t.id === teamId));
   // console.log(points);
    setStoryPoints(points);
  };

  const setupSSE = () => {
    const eventSource = new EventSource('/api/story-points/sse');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setStoryPoints(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    // Store SSE instance for cleanup
    window.storyPointsSSE = eventSource;
  };

  const selectPoints = async (id: number, points: number) => {
   // if (!currentUser) return;
   // console.log('currentUser ' + id);
    await fetch('/api/story-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, userId: id, points }),
    });
    setSelectedMembers([...selectedMembers , id]);
    fetchData();
  };

  const toggleReveal = async () => {
    await fetch('/api/story-points', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revealed: !storyPoints.revealed }),
    });
    fetchData();
  };

  const resetBoard = async () => {
    await fetch('/api/story-points', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId }),
    });
    fetchData();
  };

  const getUserPoints = (userId: number) => {
    return storyPoints.points.find(
      (p) => p.teamId === teamId && p.userId === userId
    )?.points;
  };

  //const isAdmin = team?.members.find((m) => m.id === currentUser)?.isAdmin;

  if (!team) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Story Points - {team.name}</h1>
      
      <div className="mb-8">
   

        {(
          <div className="space-x-4 mt-4">
            <button
              onClick={toggleReveal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {storyPoints.revealed ? 'Hide Points' : 'View All'}
            </button>
            <button
              onClick={fetchData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Refresh
            </button>
            <button
              onClick={resetBoard}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        { team.members.map((member) => {
          const points = getUserPoints(member.id);
          const hasVoted = points !== undefined;
          //console.log(hasVoted + '  '+ points);
          return (
            <div
              key={member.id}
              className={`p-4 rounded border ${
                hasVoted ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{member.name}</span>
                <span className="text-gray-600">
                      { hasVoted ? '✓' : '' }
                    </span>
                <div className="space-x-2">
                  {
                    POINT_OPTIONS.map((value) => (
                      <button
                        key={value}
                        onClick={() => selectPoints(member.id, value)}
                        className={`px-3 py-1 rounded ${
                          points === value && ( storyPoints.revealed || selectedMembers.includes(member.id))
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}