"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
} from "lucide-react";
import api from "@/api/client";
import { useToast } from "../../../hooks/use-toast";

interface AssociationProfile {
  id?: number;
  name: string;
  logo_url?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export default function AssociationProfile() {
  const [profile, setProfile] = useState<AssociationProfile>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch association profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching association data..."); // Debug log
        const response = await api.get("/my-association");
        console.log("API Response:", response.data); // Detailed log
        setProfile(response.data);
      } catch (error: unknown) {
        console.error("Failed to fetch profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile((prev) => ({
            ...prev,
            logo_url: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("description", profile.description);
      formData.append("address", profile.address);
      formData.append("phone", profile.phone);
      formData.append("email", profile.email);
      if (profile.website) formData.append("website", profile.website);
      if (selectedFile) formData.append("logo_url", selectedFile);

      await api.put("/my-association", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      setSelectedFile(null); // Reset selected file after save
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error.response as { data?: { message?: string } })?.data
              ?.message || "Failed to update profile"
          : "Failed to update profile";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile.name) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-background">
            <AvatarImage
              src={profile.logo_url || "/placeholder.svg"}
              alt={profile.name}
            />
            <AvatarFallback>
              <Building className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                <Camera className="h-3 w-3" />
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          {isEditing ? (
            <>
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="text-lg font-semibold"
                placeholder="Association name"
              />
              <Textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="h-20 text-sm"
                placeholder="Description"
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                {profile.description || "No description provided"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="text-sm"
              placeholder="Address"
            />
          ) : (
            <span className="text-sm">
              {profile.address || "No address provided"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="text-sm"
              placeholder="Phone"
            />
          ) : (
            <span className="text-sm">
              {profile.phone || "No phone provided"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="text-sm"
              placeholder="Email"
              type="email"
            />
          ) : (
            <span className="text-sm">{profile.email}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              name="website"
              value={profile.website || ""}
              onChange={handleChange}
              className="text-sm"
              placeholder="Website URL"
              type="url"
            />
          ) : (
            <span className="text-sm">
              {profile.website || "No website provided"}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        {isEditing ? (
          <Button
            onClick={handleSave}
            size="sm"
            className="gap-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <>
                <Save className="h-3 w-3" /> Save Changes
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            disabled={isLoading}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
