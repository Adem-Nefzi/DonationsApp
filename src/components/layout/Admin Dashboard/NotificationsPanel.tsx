"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Building, CheckCheck, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for notifications
const notifications = [
  {
    id: "1",
    type: "message",
    content: "Helping Hands Foundation sent you a message",
    time: "10 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
    read: false,
  },
  {
    id: "2",
    type: "donation",
    content: "Your donation to Food for All is in transit",
    time: "30 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
    read: false,
  },
  {
    id: "3",
    type: "message",
    content: "Children's Hope Alliance thanked you for your donation",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    read: false,
  },
];

export default function NotificationsPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-3 w-3" />;
      case "donation":
        return <Heart className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-2 p-2 rounded-lg ${
              notification.read ? "" : "bg-muted/50"
            }`}
          >
            {notification.avatar ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <Building className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                {getIcon(notification.type)}
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs">{notification.content}</p>
              <p className="text-[10px] text-muted-foreground">
                {notification.time}
              </p>
            </div>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <Button variant="ghost" size="sm" className="gap-2 text-xs h-7">
          <CheckCheck className="h-3 w-3" /> Mark all as read
        </Button>
      </div>
    </ScrollArea>
  );
}
