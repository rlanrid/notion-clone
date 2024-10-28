/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
        pathname: "/**"
      }
    ],
    domains: [
      "files.edgestore.dev"
    ]
  },
  trailingSlash: false,
}

module.exports = nextConfig
