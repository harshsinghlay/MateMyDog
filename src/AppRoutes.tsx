import React from "react";
import { Routes, Route } from "react-router-dom";
import { PetsPage } from "./pages/PetsPage";
import { PetProfile } from "./pages/PetProfile";
import { PetMatching } from "./pages/PetMatching";
import { UserProfilePage } from "./pages/UserProfilePage";
import { AuthCallback } from "./pages/AuthCallback";
import { UpdatePassword } from "./pages/UpdatePassword";
import { SharedPostPage } from "./pages/SharedPostPage";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { SocialFeed } from "./components/social/SocialFeed";
import { ChatPage } from "./components/chat/ChatPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SocialFeed />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/socialPost/:id" element={<SharedPostPage />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        }
      />
       <Route
        path="/chats"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pets/:id"
        element={
          <PrivateRoute>
            <PetProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/matching"
        element={
          <PrivateRoute>
            <PetMatching />
          </PrivateRoute>
        }
      />
      <Route
        path="/pets"
        element={
          <PrivateRoute>
            <PetsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
