import Chatbot from "../components/Chatbot";
import Container from "../components/Container";
import Navbar from "../components/Navbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-app text-slate-900 transition-colors dark:text-slate-100">
      <div className="bg-orb bg-orb-one" />
      <div className="bg-orb bg-orb-two" />

      <Navbar />

      <Container className="px-4 pb-16 pt-8 md:px-6 xl:max-w-6xl xl:px-8">
        <main className="relative z-10">{children}</main>
      </Container>

      <Chatbot />
    </div>
  );
}

export default AppShell;
