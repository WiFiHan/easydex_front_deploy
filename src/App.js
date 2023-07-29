import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./routes/HomePage";

import DexListPage from "./routes/DexList";

import BigBlockPage from "./routes/BigBlockPage";
import SignUpPage from "./routes/SignUpPage";
import SignInPage from "./routes/SignInPage";
import { useLayoutEffect } from "react";

function App() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <div className="app">
      <link
        href="https://cdn.jsdelivr.net/npm/daisyui@3.2.1/dist/full.css"
        rel="stylesheet"
        type="text/css"
      />
      <script src="https://cdn.tailwindcss.com"></script>

      <BrowserRouter>
        <Header />
        <Routes>
          {/* home */}
          <Route path="/" element={<HomePage />} />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dexlist" element={<DexListPage />} />
          <Route path="/signin" element={<SignInPage />} />

          <Route path="/Bigblock/:blockid" element={<BigBlockPage />} />

          {/* <Route path="/create" element={<PostCreatePage />} /> */}
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
