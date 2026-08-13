import MusicPlayer from "../components/music-player";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <div>
          <Navbar/>
          <Sidebar/>
          <MusicPlayer/>
           {children}
        </div>
    );
}

export default Layout;
