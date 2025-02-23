import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Lista de rotas que não precisam de autenticação
const PUBLIC_ROUTES = ['/', '/auth/sign-in', '/auth/sign-up']

// Prefixo das rotas que precisam de autenticação
const PROTECTED_PREFIX = '/dashboard'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Verifica se a rota atual começa com o prefixo protegido
  const isProtectedRoute = nextUrl.pathname.startsWith(PROTECTED_PREFIX)

  // Se a rota é protegida e o usuário não está logado, redireciona para o login
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/sign-in', nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  // Se o usuário está logado e tenta acessar uma página de autenticação, redireciona para a página principal
  if (isLoggedIn && (nextUrl.pathname === '/auth/sign-in' || nextUrl.pathname === '/auth/sign-up')) {
    return NextResponse.redirect(new URL('/', nextUrl.origin))
  }

  // Para todas as outras rotas, permite o acesso
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}