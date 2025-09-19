"use client";

import { SearchInput, SortBox } from "./index";
import LocaleSwitch from "./LocaleSwitch";
import { useTranslations } from 'next-intl';


/**
 * SearchAndSort Component
 *
 * A container component that aligns SearchInput and SortBox with the specified design:
 * - display: flex
 * - padding: 0 64px
 * - justify-content: space-between
 * - align-items: flex-start
 * - align-self: stretch
 *
 * @param {Array} sortOptions - Array of sort options for the SortBox
 * @param {string} sortValue - Currently selected sort value
 * @param {function} onSortChange - Callback when sort selection changes
 * @param {function} onSearch - Callback when search is triggered
 * @param {string} sortPlaceholder - Placeholder text for sort box
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const SearchAndSort = ({
  sortOptions = [],
  sortValue = "",
  onSortChange,
  onSearch,
  sortPlaceholder,
  className = "",
  ...rest
}) => {
  const t = useTranslations('HomePage');
  
  // Use translation if no placeholder is provided, otherwise use the passed placeholder
  const displaySortPlaceholder = sortPlaceholder || t('sortplaceholder');
  return (
        <div
          className={`flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-stretch sm:items-center self-stretch ${className}`}
          {...rest}
        >
      {/* Search Input */}
      <div className="flex-1 max-w-full sm:max-w-2xl">
        <SearchInput
          onSearch={onSearch}
          className="w-full"
        />
      </div>

      {/* Sort Box and Locale Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:ml-4 w-full sm:w-auto">
        <SortBox
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
          placeholder={displaySortPlaceholder}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
