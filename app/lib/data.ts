import { promises as fs } from 'fs';
import path from 'path';
import { Team, StoryPoint, StoryPointsState } from '../types';

const dataFilePath = path.join(process.cwd(), 'app/data/teams.json');

export async function getData() {
  const data = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(data);
}

export async function saveData(teams: Team[], storyPoints: StoryPointsState) {
  await fs.writeFile(dataFilePath, JSON.stringify({ teams, storyPoints }, null, 2));
}

export async function getTeams(): Promise<Team[]> {
  const data = await getData();
  return data.teams;
}

export async function getStoryPoints(): Promise<StoryPointsState> {
  const data = await getData();
  return data.storyPoints;
}

export async function updateTeam(team: Team) {
  const data = await getData();
  const teams = data.teams.map((t: Team) => (t.id === team.id ? team : t));
  if (!teams.find((t: Team) => t.id === team.id)) {
    teams.push(team);
  }
  await saveData(teams, data.storyPoints);
}

export async function deleteTeam(teamId: string) {
  const data = await getData();
  const teams = data.teams.filter((t: Team) => t.id !== teamId);
  await saveData(teams, data.storyPoints);
}

export async function updateStoryPoints(teamId: string, userId: string, points: number) {
  const data = await getData();
  const existingPointIndex = data.storyPoints.points.findIndex(
    (p: StoryPoint) => p.teamId === teamId && p.userId === userId
  );

  if (existingPointIndex >= 0) {
    data.storyPoints.points[existingPointIndex] = {
      teamId,
      userId,
      points,
      timestamp: Date.now(),
    };
  } else {
    data.storyPoints.points.push({
      teamId,
      userId,
      points,
      timestamp: Date.now(),
    });
  }

  await saveData(data.teams, data.storyPoints);
}

export async function resetStoryPoints(teamId: string) {
  const data = await getData();
  data.storyPoints.points = data.storyPoints.points.filter(
    (p: StoryPoint) => p.teamId !== teamId
  );
  data.storyPoints.revealed = false;
  await saveData(data.teams, data.storyPoints);
}

export async function setRevealedStatus(revealed: boolean) {
  const data = await getData();
  data.storyPoints.revealed = revealed;
  await saveData(data.teams, data.storyPoints);
}