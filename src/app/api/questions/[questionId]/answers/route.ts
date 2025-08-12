import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await params;

    const answers = await prisma.answer.findMany({
      where: { questionId },
      select: {
        id: true,
        text: true,
        isCorrect: true,
      },
    });

    return NextResponse.json(answers);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /questions/[questionId]/answers GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
