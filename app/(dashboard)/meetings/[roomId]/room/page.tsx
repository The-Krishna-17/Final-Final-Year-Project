"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMeetingById,
  joinMeetingAction,
  leaveMeetingAction,
} from "@/store/features/meetings/meetingSlice";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/utils/axiosInstance";

export default function MeetingRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentMeeting, loadingCurrent } = useAppSelector(
    (state) => state.meetings,
  );
  const { user } = useAppSelector((state) => state.auth);

  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  // Fetch meeting details when page loads
  useEffect(() => {
    if (roomId) {
      dispatch(fetchMeetingById(roomId));
    }
  }, [dispatch, roomId]);

  // Fetch JaaS JWT token from backend
  useEffect(() => {
    if (!roomId || !user) return;

    const roomName = `skillxchange_${roomId}`; // lowercase — JaaS normalizes to lowercase
    setLoadingToken(true);

    axiosInstance
      .get(`/jitsi/token?room=${encodeURIComponent(roomName)}`)
      .then((res) => {
        setJwtToken(res.data.data.token);
        setTokenError(null);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message || "Failed to get meeting token";
        // If JaaS not configured, fall back to no-token mode with warning
        if (msg.includes("not configured")) {
          setTokenError("jaas_not_configured");
        } else {
          setTokenError(msg);
        }
      })
      .finally(() => setLoadingToken(false));
  }, [roomId, user]);

  // Mark attendance when entering
  useEffect(() => {
    if (roomId && user && !isJoined) {
      dispatch(joinMeetingAction(roomId))
        .unwrap()
        .then(() => setIsJoined(true))
        .catch(() => {
          toast.error("Failed to join meeting records on server");
        });
    }
  }, [dispatch, roomId, user, isJoined]);

  // Handle cleanup on unmount or manual leave
  const handleLeave = async () => {
    if (jitsiApi) {
      jitsiApi.dispose();
    }

    if (roomId) {
      try {
        await dispatch(leaveMeetingAction(roomId)).unwrap();
        router.push(`/meetings/${roomId}`);
      } catch (err) {
        console.error(err);
        router.push("/meetings");
      }
    }
  };

  const handleApiReady = (apiObj: any) => {
    setJitsiApi(apiObj);

    apiObj.addListener("readyToClose", () => {
      handleLeave();
    });

    apiObj.addListener("participantJoined", (participant: any) => {
      toast.info(`${participant.displayName || "Someone"} joined the meeting`);
    });

    apiObj.addListener("participantLeft", (participant: any) => {
      toast.info(`${participant.displayName || "Someone"} left the meeting`);
    });
  };

  if (loadingCurrent || !currentMeeting || !user || loadingToken) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl">Preparing your meeting environment...</p>
        </div>
      </div>
    );
  }

  // JaaS not configured — show setup instructions
  if (tokenError === "jaas_not_configured") {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-gray-900 text-white p-8">
        <div className="max-w-lg text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold">JaaS Setup Required</h2>
          <p className="text-gray-300">
            To use video meetings without a login wall, you need a free{" "}
            <strong>Jitsi as a Service (JaaS)</strong> account.
          </p>
          <ol className="text-left text-sm text-gray-300 space-y-2 bg-gray-800 rounded-xl p-5 border border-gray-700">
            <li>
              <strong className="text-white">1.</strong> Go to{" "}
              <a
                href="https://jaas.8x8.vc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://jaas.8x8.vc
              </a>{" "}
              and sign up free
            </li>
            <li>
              <strong className="text-white">2.</strong> Create a new App — copy
              your <code className="text-amber-300">App ID</code>
            </li>
            <li>
              <strong className="text-white">3.</strong> Generate an API Key —
              copy the <code className="text-amber-300">Key ID</code> and
              download the{" "}
              <code className="text-amber-300">RSA Private Key</code>
            </li>
            <li>
              <strong className="text-white">4.</strong> Add to your backend{" "}
              <code className="text-amber-300">.env</code>:
              <pre className="mt-2 bg-gray-900 rounded p-3 text-xs text-green-300 overflow-x-auto">{`JAAS_APP_ID=vpaas-magic-cookie-xxxxx\nJAAS_PRIVATE_KEY_ID=your_key_id\nJAAS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...your key...\n-----END RSA PRIVATE KEY-----"`}</pre>
            </li>
            <li>
              <strong className="text-white">5.</strong> Restart your backend
              server
            </li>
          </ol>
          <button
            onClick={() => router.push("/meetings")}
            className="mt-2 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  // Generic token error
  if (tokenError) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold">Could not start meeting</h2>
          <p className="text-gray-400">{tokenError}</p>
          <button
            onClick={() => router.push("/meetings")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  // JaaS domain + room format: appId/roomName
  const appId = jwtToken
    ? (JSON.parse(atob(jwtToken.split(".")[1])).sub as string)
    : null;
  const domain = "8x8.vc";
  // JaaS room format: appId/roomName — roomName must be lowercase
  const roomName = appId
    ? `${appId}/skillxchange_${roomId}`
    : `skillxchange_${roomId}`;

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-black -m-6 p-0 overflow-hidden relative">
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        jwt={jwtToken || undefined}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          p2p: { enabled: true },
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        }}
        userInfo={{
          displayName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
          iframeRef.style.border = "none";
        }}
      />

      {/* Fallback leave button */}
      <button
        onClick={handleLeave}
        className="absolute top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium transition-colors"
      >
        Leave Meeting Room
      </button>
    </div>
  );
}
