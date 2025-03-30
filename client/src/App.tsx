import { useState, useEffect } from 'react';
import { Switch, Route, useLocation, Router } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { initDB } from '@/lib/db';
import Home from '@/pages/home';
import Camera from '@/pages/camera';
import NotFound from '@/pages/not-found';

// Debug info
console.log('App loading. Current location:', window.location.href);

// ベースパスの設定（GitHub Pagesのサブディレクトリ用）
const useBasePath = () => {
  // GitHubのリポジトリ名を取得（URLから推測）
  const repoName = getRepoNameFromUrl();
  
  // ベースパスの決定（開発環境ではベースパスなし、本番環境ではリポジトリ名を使用）
  const base = import.meta.env.PROD ? `/${repoName}` : '';
  console.log('Using base path:', base, 'in', import.meta.env.PROD ? 'production' : 'development');
  
  const [location, setLocation] = useLocation();
  console.log('Current location:', location, 'Full URL:', window.location.href);

  // 404エラーのURLを修正するための特別な処理
  useEffect(() => {
    // パスが空の場合やベースパスだけの場合はホームページへリダイレクト
    if (location === '' || location === '/' || location === base || location === `${base}/`) {
      console.log('Redirecting to home page');
      // すでにホームページにいる場合は何もしない
    } else if (!location.startsWith(base) && import.meta.env.PROD) {
      // 本番環境で、URLがベースパスで始まらない場合はリダイレクト
      console.log('Path does not include base, redirecting');
      window.location.href = `${window.location.origin}${base}/`;
    }
  }, [location, base]);

  // ベースパス付きのカスタムロケーションフック
  return [
    // 現在のパスからベースパスを取り除く
    location.startsWith(base) ? location.slice(base.length) || '/' : location,
    // 新しいパスを設定する際にベースパスを追加
    (to: string) => {
      console.log('Navigating to:', to, 'with base:', base + to);
      setLocation(base + to);
    }
  ] as const;
};

// URLからリポジトリ名を取得する関数
function getRepoNameFromUrl() {
  const { hostname, pathname } = window.location;
  
  // GitHubのPages URLかどうかをチェック（username.github.io形式）
  if (hostname.endsWith('github.io')) {
    // パスから最初のセグメントを取得（/repoName/...）
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      console.log('Detected repo name from URL:', pathParts[0]);
      return pathParts[0];
    }
  }
  
  // デフォルトのリポジトリ名（既知の値を使用）
  return 'replit-HomeSecure';
}

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const locationHook = useBasePath();

  useEffect(() => {
    console.log('Initializing database...');
    initDB()
      .then(() => {
        console.log('Database initialized successfully');
        setDbInitialized(true);
      })
      .catch(error => {
        console.error('Failed to initialize database:', error);
        // データベース初期化失敗時もStateを更新して、エラー表示できるようにする
        setDbInitialized(true);
      });
  }, []);

  if (!dbInitialized) {
    console.log('Waiting for database initialization...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  console.log('Rendering app with routes');
  return (
    <>
      <Router hook={locationHook}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/camera" component={Camera} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}

export default App;