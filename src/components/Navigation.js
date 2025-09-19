import {useTranslations} from 'next-intl';

import NavigationLink from './NavigationLink';
import LocaleSwitch from './LocaleSwitch';
export default function Navigation() {
  const t = useTranslations('Navigation');

  return (
    <div className="">
      <nav className="container flex justify-between p-2 text-white">
        <div>
          <NavigationLink href="/">{t('home')}</NavigationLink>
        </div>
        <LocaleSwitch />
      </nav>
    </div>
  );
}