import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BreedDetail from "./pages/BreedDetail";
import DogCare from "./pages/DogCare";
import Adoption from "./pages/Adoption";
import MoreFacts from "./pages/MoreFacts";
import Interview from "./pages/Interview";
import Account from "./pages/Account";
import Games from "./pages/Games";
import GameBlockBlast from "./pages/GameBlockBlast";
import GameFetch from "./pages/GameFetch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/breed/:id" element={<BreedDetail />} />
          <Route path="/care" element={<DogCare />} />
          <Route path="/adopt" element={<Adoption />} />
          <Route path="/more-facts" element={<MoreFacts />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/account" element={<Account />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/block-blast" element={<GameBlockBlast />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
