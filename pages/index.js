import { useEffect, useState } from 'react';
import Head from 'next/head';
import Post from '../components/post';
import Spinner from '../components/Spinner';

function HomePage({ apiClient }) {
  async function fetchEntries() {
    const entries = await apiClient.getEntries();
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function getPosts() {
      const allPosts = await fetchEntries();

      setLoading(false);
      setPosts([...allPosts]);
    }
    getPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Next.js + Covid</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <Spinner width={48} height={48} color="#059669" />
        ) : posts.length > 0 ? (
          posts.map((p) => {
            console.log(p);
            return (
              <Post
                date={p.fields.date}
                key={p.sys.id}
                id={p.sys.id}
                fullname={p.fields.fullName}
                address={p.fields.address}
                status={p.fields.covidStatusFlag}
                date={p.sys.createdAt}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
}

export default HomePage;
