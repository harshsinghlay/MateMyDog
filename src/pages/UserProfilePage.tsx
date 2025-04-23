import React, { useState, useEffect } from "react";
import { Camera, MapPin, UserCircle, Power } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useMediaUpload } from "../hooks/useMediaUpload";
import { userService } from "../lib/supabase/services/userService";
import { UserPosts } from "../components/user/UserPosts";
import type { User } from "../types/user";
import { useDebounce } from "../hooks/useDebounce";

export function UserProfilePage() {
  const { user, setUser } = useAuth();
  const { uploadMedia, uploading } = useMediaUpload();
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const [activeStatus, setActiveStatus] = useState(user?.isActive);


  const { execute: debouncedUpdateStatus } = useDebounce(
    async (isActive: boolean) => {
      if (!user?.id) return;
      await userService.updateUserActiveStatus(user.id, isActive);
      return isActive;
    },
    {
      delay: 500,
      onError: (error) => {
        toast.error("Failed to update active status");
        setActiveStatus(!activeStatus); // Revert on error
      },
    }
  );

  const handleActiveStatusChange = async (checked: boolean) => {
    setActiveStatus(checked);
    try {
      await debouncedUpdateStatus(checked);
      toast.success(`Profile ${checked ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user?.id]);

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=d53b5d37bc7c422e8b9f7f6bcf720ed8`
          );
          const data = await response.json();

          if (data.results?.[0]?.components) {
            const { city, state, country, postcode } =
              data.results[0].components;
            const { lat, lng } = data.results[0].geometry;
            setUserInfo((prev) =>
              prev
                ? {
                  ...prev,
                  location: {
                    id: prev.location.id,
                    city: city || "",
                    state: state || "",
                    country: country || "",
                    postalCode: postcode || "",
                    lat: lat || "",
                    lng: lng || "",
                  },
                }
                : null
            );
          }
          toast.dismiss();
          toast.success("Location detected successfully");
        } catch (error) {
          console.error("Error detecting location:", error);
          toast.dismiss();
          toast.error("Failed to detect location");
        }
      },
      () => {
        toast.dismiss();
        toast.error("Unable to retrieve your location");
      }
    );
  };

  const updateUser = async (userId: string, info: User): Promise<void> => {
    try {
      setSaving(true);
      await userService.updateUserInfo(userId, info);
      setUser(info);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !userInfo) return;

    const updateData: User = {
      id: userInfo.id,
      fullName: userInfo.fullName,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
      location: userInfo.location,
      isActive: userInfo.isActive
    };

    await updateUser(user.id, updateData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userInfo) {
      toast.error("No file selected or user not found");
      return;
    }

    try {
      const [media] = await uploadMedia([file]);

      if (!media?.url) {
        throw new Error("Failed to upload media");
      }

      setUserInfo((prev) =>
        prev
          ? {
            ...prev,
            avatarUrl: media.url,
          }
          : null
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
    }
  };


  if (!userInfo) {
    return (
      <div className="h-full flex items-center justify-center ">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user profile</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full overflow-hidden">
                    {uploading ? (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : userInfo.avatarUrl ? (
                      <img
                        src={userInfo.avatarUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <UserCircle className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <input
                      type="file"
                      accept={allowedTypes.join(",")}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-serif font-semibold text-gray-900">
                    {userInfo.fullName || "Your Profile"}
                  </h1>
                  <p className="text-gray-500">{userInfo.email}</p>
                </div>
              </div>

              {/* Active Status Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeStatus}
                  onChange={(e) => handleActiveStatusChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {activeStatus ? "Active" : "Inactive"}
                </span>
              </label>


            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userInfo.fullName || ""}
                  onChange={(e) =>
                    setUserInfo((prev) =>
                      prev ? { ...prev, fullName: e.target.value } : null
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 cursor-not-allowed"
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Location
                  </h2>
                  <button
                    type="button"
                    onClick={handleLocationDetection}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Detect Location
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={userInfo.location?.city || ""}
                      onChange={(e) =>
                        setUserInfo((prev) =>
                          prev
                            ? {
                              ...prev,
                              location: {
                                ...(prev.location || {}),
                                city: e.target.value,
                              },
                            }
                            : null
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={userInfo.location?.state || ""}
                      onChange={(e) =>
                        setUserInfo((prev) =>
                          prev
                            ? {
                              ...prev,
                              location: {
                                ...(prev.location || {}),
                                state: e.target.value,
                              },
                            }
                            : null
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={userInfo.location?.country || ""}
                      onChange={(e) =>
                        setUserInfo((prev) =>
                          prev
                            ? {
                              ...prev,
                              location: {
                                ...(prev.location || {}),
                                country: e.target.value,
                              },
                            }
                            : null
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={userInfo.location?.postalCode || ""}
                      onChange={(e) =>
                        setUserInfo((prev) =>
                          prev
                            ? {
                              ...prev,
                              location: {
                                ...(prev.location || {}),
                                postalCode: e.target.value,
                              },
                            }
                            : null
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {userInfo && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Your Posts</h2>
            <UserPosts userId={userInfo.id} />
          </div>
        )}
      </div>
    </div>
  );
}
