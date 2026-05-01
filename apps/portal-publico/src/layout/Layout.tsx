import Header from "../components/Header";
import Background from "../components/Background";
import Footer from "../components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Background>{children}</Background>
      <Footer />
    </div>
  );
}