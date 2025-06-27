import Navbar from "../components/Navbar";
import Footer from "../components/Footer.";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="p-3">{children}</main> {/* Page content goes here */}
      <Footer/>
    </>
  );
};

export default MainLayout;
