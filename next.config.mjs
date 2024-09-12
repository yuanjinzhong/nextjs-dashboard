/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental:{
        ppr: 'incremental' //实验性功能,开启部分预渲染

    }
};

export default nextConfig;
