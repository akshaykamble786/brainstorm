import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import React from "react";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default HomePageLayout;
