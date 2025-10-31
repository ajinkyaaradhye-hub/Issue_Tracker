import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, Avatar } from 'flowbite-react';
import type { ReactNode } from 'react';
import { HiOutlineViewList, HiOutlineUser, HiLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface SidebarLayoutProps {
  email: string;
  name: string;
  onLogout: () => void;
  children: ReactNode;
}

export default function SidebarLayout({ email, name, onLogout, children }: SidebarLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen h-full">
      <div className="h-full w-64 shadow-md border-r border-gray-200 flex flex-col">
        <Sidebar aria-label="App sidebar">
          <div className="flex flex-col items-center py-6 border-b border-b border-gray-100">
            <Avatar
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
              size="lg"
            />
            <p className="mt-3 text-sm font-medium text-gray-800">{name}</p>
            <p className="mt-3 text-sm font-medium text-gray-800">{email}</p>
          </div>

          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem icon={HiOutlineViewList} onClick={() => navigate('/issues')}>
                Issues
              </SidebarItem>

              <SidebarItem icon={HiOutlineUser} onClick={() => navigate('/profile')}>
                Profile
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>

          <div className="mt-auto p-4 border-t">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 text-red-600 hover:text-red-800 transition border-b border-gray-100"
            >
              <HiLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </Sidebar>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
