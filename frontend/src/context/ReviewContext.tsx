import { createContext, useContext, useState, type ReactNode } from 'react';

interface ReviewContextType {
  // Manual Review State
  manualCode: string;
  setManualCode: (code: string) => void;
  manualResult: any | null;
  setManualResult: (result: any | null) => void;
  manualSplitView: boolean;
  setManualSplitView: (val: boolean) => void;

  // Repo Review State
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  repoFiles: any[];
  setRepoFiles: (files: any[]) => void;
  repoSelectedFile: any | null;
  setRepoSelectedFile: (file: any | null) => void;
  repoResult: any | null;
  setRepoResult: (result: any | null) => void;
  repoSplitView: boolean;
  setRepoSplitView: (val: boolean) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  // Manual States
  const [manualCode, setManualCode] = useState('');
  const [manualResult, setManualResult] = useState<any | null>(null);
  const [manualSplitView, setManualSplitView] = useState(false);

  // Repo States
  const [repoUrl, setRepoUrl] = useState('');
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [repoSelectedFile, setRepoSelectedFile] = useState<any | null>(null);
  const [repoResult, setRepoResult] = useState<any | null>(null);
  const [repoSplitView, setRepoSplitView] = useState(false);

  const value = {
    manualCode, setManualCode,
    manualResult, setManualResult,
    manualSplitView, setManualSplitView,
    repoUrl, setRepoUrl,
    repoFiles, setRepoFiles,
    repoSelectedFile, setRepoSelectedFile,
    repoResult, setRepoResult,
    repoSplitView, setRepoSplitView
  };

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReviewContext() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviewContext must be used within a ReviewProvider');
  }
  return context;
}
