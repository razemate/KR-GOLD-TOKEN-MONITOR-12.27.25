import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the host is gold.katusaresearch.com
  if (request.nextUrl.hostname === 'gold.katusaresearch.com') {
    return NextResponse.redirect(new URL('https://subscribers.katusaresearch.com/gold-token-monitor/', request.url))
  }
}
