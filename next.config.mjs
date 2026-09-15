/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://recipe-hub-server-phi.vercel.app';
    return [
      {
        source: '/api/image-upload',
        destination: `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_UPLOAD_API || process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || '5ab98d52afb781919acb234f105b27be'}`,
      },
      {
        source: '/api/:path*',
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
