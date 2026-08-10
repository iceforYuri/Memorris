import { pathsEqual, url } from '@/utils/url-utils'
import { getPathnameFromVisitUrl, checkIsHomePage } from './dom'
import type { VisitContext } from './types'

export function buildVisitContext(toUrl: string): VisitContext {
	const pathname = getPathnameFromVisitUrl(toUrl)
	return {
		toUrl,
		pathname,
		isHome: pathsEqual(pathname, url('/')),
		isMobile: window.innerWidth < 1024,
	}
}

export function buildVisitContextFromPathname(pathname?: string): VisitContext {
	const path = pathname ?? window.location.pathname
	return {
		toUrl: path,
		pathname: path,
		isHome: checkIsHomePage(path),
		isMobile: window.innerWidth < 1024,
	}
}
