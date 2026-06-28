import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

instance.interceptors.request.use(
  (config) => {
    console.log(`[API Call] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── In-memory cache for profile to avoid redundant API calls ──
// Multiple pages (Dashboard, PropertiesListing, PropertyDetail, Settings)
// all independently call GET /auth/profile on mount. This caches the result
// for 30 seconds so only the first call hits the network.
const profileCache = { data: null, timestamp: 0 }
const CACHE_TTL = 30_000 // 30 seconds

instance.interceptors.response.use((response) => {
  // Cache profile responses
  if (response.config.url === '/auth/profile' && response.config.method === 'get') {
    profileCache.data = response.data
    profileCache.timestamp = Date.now()
  }
  return response
})

// Override GET to serve cached profile when fresh
const originalGet = instance.get.bind(instance)
instance.get = (url, config) => {
  if (url === '/auth/profile' && profileCache.data && (Date.now() - profileCache.timestamp < CACHE_TTL)) {
    return Promise.resolve({ data: profileCache.data })
  }
  return originalGet(url, config)
}

// Invalidate cache whenever profile-affecting data changes:
// logout, login (in case a different account logs in without logging out first),
// save/unsave toggles, and role switches all need a fresh profile next time.
export const clearProfileCache = () => {
  profileCache.data = null
  profileCache.timestamp = 0
}

// Auto-invalidate on any request that mutates profile-related data,
// so callers don't have to remember to call clearProfileCache() everywhere.
const MUTATING_PATHS = ['/auth/save/', '/auth/switch-role']
instance.interceptors.request.use((config) => {
  const url = config.url || ''
  if (MUTATING_PATHS.some((p) => url.includes(p))) {
    clearProfileCache()
  }
  return config
})

export default instance