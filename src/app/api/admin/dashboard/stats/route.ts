import { NextRequest, NextResponse } from 'next/server';
import { can } from '@/lib/permissions';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { getDashboardStats } from '@/models/dashboardModel';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const actor = await requireAdmin(request);
    const data = await getDashboardStats();
    if(!can(actor.role,'auditLogs','read')) data.recentAuditLogs=[];
    if(!can(actor.role,'contactSubmissions','read')) { data.recentInquiries=[]; data.counts.unreadInquiries=0; }
    if(!can(actor.role,'donors','read')) { data.recentDonations=[]; data.counts.donors=0; data.counts.totalDonationsUsd=0; }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError(error);
  }
}
