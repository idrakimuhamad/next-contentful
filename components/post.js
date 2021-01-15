import Link from 'next/link';

function Post({ id, date, fullname, address, status }) {
  return (
    <div className="container">
      <Link href={`/patient/${id}`}>
        <div className="text">
          <h2>{fullname}</h2>
          <h4>{address}</h4>
          <h6>Covid status: {status.toString()}</h6>
        </div>
      </Link>
      <style jsx>{`
        .container {
          cursor: pointer;
        }
        a {
          border-bottom: none;
        }
        a:hover {
          border-bottom: none;
        }
        h2 {
          font-size: 24px;
          margin-bottom: 0;
        }
        h4 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

export default Post;
