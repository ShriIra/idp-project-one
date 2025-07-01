// Component Imports
import LangRedirect from '@components/LangRedirect'

// Config Imports
import { i18n } from '@configs/i18n'

// ℹ️ We've to create this array because next.js makes request with `_next` prefix for static/asset files
const invalidLangs = ['_next']

const TranslationWrapper = params => {
  const doesLangExist = i18n.locales.includes(params.lang)

  // ℹ️ This doesn't mean MISSING, it means INVALID
  const isInvalidLang = invalidLangs.includes(params.lang)

  const redirectPrefix = process.env.NEXT_PUBLIC_APP_URL.replace(
    'demo-1',
    params.headersList.get('X-server-header') ?? 'demo-1'
  )

  return doesLangExist || isInvalidLang ? params.children : <LangRedirect redirectPrefix={redirectPrefix} />
}

export default TranslationWrapper
