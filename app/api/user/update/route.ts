import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, email, currentPassword, newPassword } = await req.json();
    await dbConnect();
    const userId = (session.user as { id?: string }).id;

    if (newPassword) {
      // Password change flow
      const user = await User.findById(userId);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      const hashed = await bcrypt.hash(newPassword, 12);
      await User.findByIdAndUpdate(userId, { $set: { hashedPassword: hashed } });
    } else {
      // Profile update
      const updates: Record<string, string> = {};
      if (name) updates.name = name.trim();
      if (email) updates.email = email.toLowerCase().trim();
      await User.findByIdAndUpdate(userId, { $set: updates });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
