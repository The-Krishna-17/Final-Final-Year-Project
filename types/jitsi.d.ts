declare module "@jitsi/react-sdk" {
  import { ComponentType } from "react";

  export interface JitsiMeetingProps {
    domain?: string;
    roomName: string;
    jwt?: string;
    configOverwrite?: Record<string, any>;
    interfaceConfigOverwrite?: Record<string, any>;
    userInfo?: {
      displayName?: string;
      email?: string;
    };
    onApiReady?: (apiObj: any) => void;
    getIFrameRef?: (iframeRef: HTMLIFrameElement) => void;
  }

  export const JitsiMeeting: ComponentType<JitsiMeetingProps>;
}
