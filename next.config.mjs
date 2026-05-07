/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Vercel Blob hostnames (uploads in production)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ]
      },
      {
        // Prevent search engines from indexing the admin and review pages
        source: "/(manage|review)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      }
    ];
  }
};

export default nextConfig;
