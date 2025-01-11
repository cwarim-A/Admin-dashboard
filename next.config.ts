import { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Allow images from Cloudinary
  },
};

export default config;