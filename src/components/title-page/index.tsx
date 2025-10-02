import { usePathname } from 'next/navigation';
import * as React from 'react';

interface TitlePageProps {
  title?: string;
  className?: string;
}

const TitlePage: React.FC<TitlePageProps> = (props) => {
  const paths = usePathname();

  const title = React.useMemo(() => {
    const getTitleFromPaths = paths
      .split('/')
      .filter((path) => path)
      ?.slice(-1)?.[0]
      ?.replace(/[^\w\s]/gi, ' ');

    const capitalizeTitle = getTitleFromPaths
      ?.split(' ')
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(' ');

    return capitalizeTitle;
  }, [paths]);

  return <h1 className={`text-[32px] font-bold p-0 m-0 ${props.className}`}>{props.title ?? title}</h1>;
};

export default TitlePage;
