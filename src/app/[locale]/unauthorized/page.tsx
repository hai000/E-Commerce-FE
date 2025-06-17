import {useTranslations} from "next-intl";

export default function UnauthorizedPage() {
    console.log('a')
    const t = useTranslations()
    return (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h1>{t('No permission')}</h1>
            <p>{t('You dont have permission')}.</p>
        </div>
    )
}