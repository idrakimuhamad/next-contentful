import Link from 'next/link';
import { DateTime } from 'luxon';

function Post({ id, date, fullname, address, status }) {
  const dt = DateTime.fromISO(date);
  return (
    <Link href={`/patient/${id}`}>
      <div className="py-8 flex flex-wrap md:flex-nowrap cursor-pointer">
        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <span className="mt-1 text-gray-500 text-sm">
            {dt.toLocaleString(DateTime.DATETIME_SHORT)}
          </span>
        </div>
        <div className="md:flex-grow">
          <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
            {fullname}
          </h2>
          <p className="leading-relaxed">{address}</p>
          <p className="text-indigo-500 inline-flex items-center mt-4">
            Status: {status ? 'POSITIVE' : 'NEGATIVE'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Post;
