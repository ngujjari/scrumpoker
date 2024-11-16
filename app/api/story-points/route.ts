import { NextResponse } from 'next/server';
import { getStoryPoints, updateStoryPoints, resetStoryPoints, setRevealedStatus } from '@/app/lib/data';

export async function GET() {
  const storyPoints = await getStoryPoints();
  return NextResponse.json(storyPoints);
}

export async function POST(request: Request) {
  const { teamId, userId, points } = await request.json();
  await updateStoryPoints(teamId, userId, points);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { revealed } = await request.json();
  await setRevealedStatus(revealed);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { teamId } = await request.json();
  await resetStoryPoints(teamId);
  return NextResponse.json({ success: true });
}