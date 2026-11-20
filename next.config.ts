import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/*': ['./prisma/certs/*.pem']
  }
};

export default nextConfig;
