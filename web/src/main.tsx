import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { AppShell } from "./components/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Resumes } from "./pages/Resumes";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { ApiError } from "./lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: (count, err) => !(err instanceof ApiError && err.status < 500) && count < 2, refetchOnWindowFocus: false },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/signin", element: <SignIn /> },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "resumes", element: <Resumes /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
