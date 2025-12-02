'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function GuestMeetPage({ params }: { params: Promise<{ slug: string }> }) {
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const [loading, setLoading] = useState(true);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Hata</h1>
          <p className="text-gray-400">Geçersiz bağlantı. Lütfen organizatörden yeni bir link isteyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-900 text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium">Bağlantı kuruluyor...</p>
          </div>
        </div>
      )}
      
      <JitsiMeeting
        roomName={room}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true, // Prevent mobile app redirect
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        }}
        userInfo={{
          displayName: 'Misafir'
        }}
        onApiReady={(externalApi) => {
          setLoading(false);
        }}
        getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
      />
    </div>
  );
}
