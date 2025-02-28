import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <main className="flex-[1] overflow-y-auto">
            <AppRoutes />
          </main>
        </Layout>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
