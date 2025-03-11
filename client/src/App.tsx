import { useState, useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { initDB } from '@/lib/db';
import Home from '@/pages/home';
import Camera from '@/pages/camera';
import NotFound from '@/pages/not-found';

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDB()
      .then(() => setDbInitialized(true))
      .catch(error => {
        console.error('Failed to initialize database:', error);
        // データベース初期化失敗時もStateを更新して、エラー表示できるようにする
        setDbInitialized(true);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/camera" component={Camera} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;