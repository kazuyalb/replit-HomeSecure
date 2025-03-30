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
  // 開発環境ではベースパスなし、本番環境ではベースパスを設定
  const base = import.meta.env.PROD ? '/replit-HomeSecure' : '';
  console.log('Using base path:', base, 'in', import.meta.env.PROD ? 'production' : 'development');
  
  const [location, setLocation] = useLocation();
  console.log('Current location from wouter:', location);

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