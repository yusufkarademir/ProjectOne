'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles } from 'react-joyride';
import { HelpCircle } from 'lucide-react';

interface TourGuideProps {
  steps: Step[];
  run: boolean;
  onRestart?: () => void;
}

export default function TourGuide({ steps, run, onRestart }: TourGuideProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      // Save to local storage that the user has finished the tour
      localStorage.setItem('tour_completed', 'true');
    }
  };

  const tourStyles: Styles = {
    options: {
      zIndex: 10000,
      primaryColor: '#4F46E5', // Indigo-600
      textColor: '#1F2937', // Gray-800
      backgroundColor: '#ffffff',
      arrowColor: '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonNext: {
      backgroundColor: '#4F46E5',
      color: '#ffffff',
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    buttonBack: {
      color: '#6B7280',
      marginRight: '0.5rem',
    },
    buttonSkip: {
      color: '#9CA3AF',
    },
    tooltip: {
      borderRadius: '1rem',
      padding: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    tooltipTitle: {
      fontSize: '1.125rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
      color: '#111827',
    },
    tooltipContent: {
      fontSize: '0.95rem',
      color: '#4B5563',
      lineHeight: '1.5',
    },
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={runTour}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={tourStyles}
      locale={{
        back: 'Geri',
        close: 'Kapat',
        last: 'Bitir',
        next: 'İleri',
        open: 'Turu Aç',
        skip: 'Atla',
      }}
      floaterProps={{
        disableAnimation: true,
      }}
    />
  );
}
