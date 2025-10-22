'use client'

import { useTranslations } from 'next-intl'

import { LoadingState } from '@/components/loading-state'

const NotFound = () => {
  const t = useTranslations('errors')

  return (
    <div className="container mx-auto">
      <LoadingState
        title={t('pageNotFound')}
        message={t('pageNotFoundDescription')}
        additionalInfo={t('pageNotFoundCta')}
        buttonText={t('backToHome')}
        buttonHref="/"
      />
    </div>
  )
}

export default NotFound
