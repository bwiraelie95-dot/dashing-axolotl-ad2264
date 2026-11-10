import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError, getRequestIp } from '@/lib/http';
import { changePasswordSchema } from '@/lib/validation';
import { userModel } from '@/models/userModel';
import { logAuditAction } from '@/models/auditModel';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdmin(request);
    const credentials = changePasswordSchema.parse(await request.json());
    const changed = await userModel.changePassword(actor.id, credentials.currentPassword, credentials.newPassword);

    if (!changed) {
      return NextResponse.json({ success: false, error: 'Le mot de passe actuel est incorrect.' }, { status: 401 });
    }

    await logAuditAction(
      { userName: actor.name, userEmail: actor.email },
      'password_change',
      'auth',
      'Mot de passe administrateur modifié de manière sécurisée.',
      actor.id,
      getRequestIp(request)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
