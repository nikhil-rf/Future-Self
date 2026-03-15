import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    await dbConnect();
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { $set: { status: 'archived' } },
      { new: true }
    );

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0a0a0f;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;background:#111118;padding:40px;border-radius:16px;border:1px solid #1e1e2e;">
          <h2 style="color:#10b981;margin:0 0 12px;">✅ Done!</h2>
          <p style="color:#9ca3af;margin:0;">Great job! This reminder has been marked as done.</p>
        </div>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Done error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
