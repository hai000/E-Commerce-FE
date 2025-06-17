import {getTranslations} from "next-intl/server";

export default async function UnauthorizedPage() {
    const t = await getTranslations()
    return (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h1>{t('No permission')}</h1>
            <p>{t('You dont have permission')}.</p>
        </div>
    )
}