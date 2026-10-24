import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "../core/query/client.js";
import { ErrorBoundary } from "./ErrorBoundary.js";
import { LocaleHome } from "./LocaleHome.js";
import { ProtectedRoute } from "./ProtectedRoute.js";
import { PublicLayout } from "./PublicLayout.js";
import { RootRedirect } from "./RootRedirect.js";
import { RoutedPage } from "./RoutedPage.js";
import { portalRoutes, publicRoutes } from "./routes/registry.js";

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:locale" element={<PublicLayout />}>
        <Route index element={<LocaleHome />} />
        {publicRoutes
          .filter((route) => route.path)
          .map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RoutedPage route={route} />}
            />
          ))}
        <Route element={<ProtectedRoute />}>
          {portalRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RoutedPage route={route} />}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}
