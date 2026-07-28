"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { RiStarFill, RiStarLine, RiUserLine, RiMessage2Line } from "react-icons/ri";
import { format } from "date-fns";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        setLoading(true);
        // Assuming we have an endpoint to fetch user's public info
        // Wait, do we have one?
        // If not, we might need to rely on the reviews and maybe an existing endpoint.
        // Let's just try fetching from /users/:id or similar if it exists.
        // Actually, we created /reviews/user/:userId which gives us reviews.
        // Let's also fetch the user info if possible.
        const [userRes, reviewsRes] = await Promise.all([
          axiosInstance.get(`/users/${userId}`),
          axiosInstance.get(`/reviews/user/${userId}`)
        ]);
        
        setProfile(userRes.data.data.user);
        setReviews(reviewsRes.data.data.reviews);
      } catch (error) {
        console.error("Failed to fetch public profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchProfileAndReviews();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <RiUserLine className="text-4xl opacity-20" />
        <p>User not found.</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "No ratings yet";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-linear-to-r from-primary/60 via-primary/70 to-primary/50 relative"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl bg-muted text-primary">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm font-medium">
                <RiStarFill className="text-yellow-500" />
                {averageRating}
                {reviews.length > 0 && <span className="text-muted-foreground ml-1">({reviews.length} reviews)</span>}
              </Badge>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <RiMessage2Line className="text-primary" />
          Reviews from Skill Swaps
        </h2>
        
        {reviews.length === 0 ? (
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <RiStarLine className="text-4xl opacity-20 mb-3" />
              <p>No reviews yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.reviewer.avatar} />
                        <AvatarFallback>
                          {review.reviewer.firstName?.[0]}{review.reviewer.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {review.reviewer.firstName} {review.reviewer.lastName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= review.rating ? <RiStarFill key={star} /> : <RiStarLine key={star} className="text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50">
                    "{review.feedback}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
