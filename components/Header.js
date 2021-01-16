import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Header({ client }) {
  async function fetchAssets() {
    const assets = await client.getAssets();
    if (assets.items) return assets.items;
    console.log(`Error getting Assets for ${contentType.name}.`);
  }

  function findAppLogo(allAssets) {
    const logo = allAssets.find((asset) => asset.fields.title === 'logo');

    return logo?.fields?.file?.url;
  }

  const [logo, setLogo] = useState('');

  useEffect(() => {
    async function getAssets() {
      const allAssets = await fetchAssets();
      const appLogo = findAppLogo(allAssets);

      setLogo(appLogo);
    }
    getAssets();
  }, []);

  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" passHref>
              <a>
                <img src={logo} className="w-16" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
