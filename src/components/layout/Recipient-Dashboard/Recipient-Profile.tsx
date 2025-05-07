"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, MapPin, Phone, Mail, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for recipient profile
const initialProfile = {
  name: "Maria Garcia",
  avatar: "/placeholder.svg?height=100&width=100",
  address: "456 Elm St, New York, NY 10002",
  phone: "(555) 987-6543",
  email: "maria.garcia@example.com",
  familySize: "5",
  needs: "Winter clothing, food assistance, school supplies for children",
};

export default function RecipientProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    // In a real app, you would save the profile to the backend
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-background">
            <AvatarImage
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
            />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
            >
              <Camera className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          {isEditing ? (
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="text-lg font-semibold"
            />
          ) : (
            <h2 className="text-lg font-semibold">{profile.name}</h2>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="text-sm"
                placeholder="Address"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.address}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="text-sm"
                placeholder="Phone"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="text-sm"
                placeholder="Email"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.email}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="familySize">Family Size</Label>
          {isEditing ? (
            <Select
              value={profile.familySize}
              onValueChange={(value) => handleSelectChange("familySize", value)}
            >
              <SelectTrigger id="familySize">
                <SelectValue placeholder="Select family size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 (Individual)</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6+">6+</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Family of {profile.familySize}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="needs">Primary Needs</Label>
        {isEditing ? (
          <Textarea
            id="needs"
            name="needs"
            value={profile.needs}
            onChange={handleChange}
            className="h-20 text-sm"
            placeholder="Describe your primary needs"
          />
        ) : (
          <p className="text-sm p-2 bg-muted rounded-md">{profile.needs}</p>
        )}
      </div>

      <div className="flex justify-end">
        {isEditing ? (
          <Button onClick={handleSave} size="sm" className="gap-1">
            <Save className="h-3 w-3" /> Save Changes
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="sm">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
