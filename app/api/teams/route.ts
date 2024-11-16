import { NextResponse } from 'next/server';
import { getTeams, updateTeam, deleteTeam } from '@/app/lib/data';

export async function GET() {
  const teams = await getTeams();
  return NextResponse.json(teams);
}

export async function POST(request: Request) {
  const team = await request.json();
  await updateTeam(team);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { teamId } = await request.json();
  await deleteTeam(teamId);
  return NextResponse.json({ success: true });
}