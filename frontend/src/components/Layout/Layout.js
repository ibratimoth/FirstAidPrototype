import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast'
import 'react-toastify/dist/ReactToastify.css'

const Layout = ({ children, title, description, keywords, author}) => {
  return (
    <div>
      <Helmet>
        <div>
          <meta charSet="UTF-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <title>{title}</title>
        </div>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster/>
        {children}</main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "First Aid App",
  description: "mern stack Project",
  keywords: "react, node, mongodb",
  author: "Ibrahim"
}
export default Layout;
