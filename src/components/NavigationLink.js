'use client';

import { clsx } from "clsx";
import {useSelectedLayoutSegment} from 'next/navigation';
import { Link } from '../../i18n/navigation';

export default function NavigationLink({href, ...rest}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'inline-block px-2 py-3 transition-colors',
        isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
      )}
      href={href}
      {...rest}
    />
  );
}
