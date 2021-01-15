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
    <div
      style={{
        padding: 24,
      }}>
      <img
        src={logo}
        style={{
          width: '8rem',
        }}
      />
    </div>
  );
}
