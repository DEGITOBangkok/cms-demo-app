import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your custom Next.js config options here (if any)
};

export default withNextIntl(nextConfig);
