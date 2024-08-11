import { setMenu } from '@/redux/slices/menuSlice';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const menu = useSelector((state:any) => state.menu.name);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    

      <nav>
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link className="font-medium" to="/">
             {menu || 'Dashboard'}
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium dark:text-yellow text-orange">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
