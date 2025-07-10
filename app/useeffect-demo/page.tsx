'use client';

import { useState, useEffect } from 'react';

export default function UseEffectDemoPage() {
  // 1. 基本的なカウンター状態
  const [count, setCount] = useState(0);

  // 2. タイマーの状態
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 3. APIデータの状態
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 4. ウィンドウサイズの状態
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // useEffect例1: コンポーネントマウント時に1回だけ実行
  useEffect(() => {
    console.log('🚀 コンポーネントがマウントされました！');

    // ウィンドウサイズを初期化
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // クリーンアップ関数（コンポーネントがアンマウントされる時に実行）
    return () => {
      console.log('🧹 コンポーネントがアンマウントされました！');
    };
  }, []); // 空の依存配列 = マウント時のみ実行

  // useEffect例2: countが変更されるたびに実行
  useEffect(() => {
    console.log(`📊 countが${count}に変更されました`);

    // countが10の倍数の時にアラートを表示
    if (count > 0 && count % 10 === 0) {
      alert(`🎉 ${count}に到達しました！`);
    }
  }, [count]); // countが変更されるたびに実行

  // useEffect例3: タイマー機能（クリーンアップ付き）
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning) {
      console.log('⏰ タイマーが開始されました');
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    // クリーンアップ関数：タイマーを停止
    return () => {
      if (interval) {
        console.log('⏹️ タイマーが停止されました');
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]); // isTimerRunningが変更されるたびに実行

  // useEffect例4: ウィンドウサイズ変更の監視
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // クリーンアップ：イベントリスナーを削除
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // マウント時のみ実行

  // APIからユーザー情報を取得する関数
  const fetchUserData = async () => {
    setLoading(true);
    setUser(null);

    try {
      // JSONPlaceholderの偽APIを使用
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('ユーザーデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect例5: 非同期データの取得
  useEffect(() => {
    if (user) {
      console.log('👤 ユーザーデータが更新されました:', user.name);
    }
  }, [user]); // userが変更されるたびに実行

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          useEffect 実践デモ
        </h1>

        {/* 説明セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">useEffectとは？</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>useEffect</strong>は、React関数コンポーネントで副作用（side effects）を実行するためのフックです。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">主な用途：</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>データの取得（API呼び出し）</li>
                <li>イベントリスナーの設定・削除</li>
                <li>タイマーやインターバルの管理</li>
                <li>DOM の直接操作</li>
                <li>クリーンアップ処理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* デモセクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 基本的なカウンター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              1. 基本的なカウンター
            </h3>
            <p className="text-gray-600 mb-4">
              countが変更されるたびにuseEffectが実行されます
            </p>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-4">
                {count}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  +1
                </button>
                <button
                  onClick={() => setCount(count - 1)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  -1
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>

          {/* タイマー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              2. タイマー（クリーンアップ付き）
            </h3>
            <p className="text-gray-600 mb-4">
              setIntervalとclearIntervalのクリーンアップ例
            </p>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-4">
                {seconds}秒
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-4 py-2 rounded text-white ${
                    isTimerRunning
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isTimerRunning ? 'ストップ' : 'スタート'}
                </button>
                <button
                  onClick={() => {
                    setSeconds(0);
                    setIsTimerRunning(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>

          {/* API データ取得 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">
              3. API データ取得
            </h3>
            <p className="text-gray-600 mb-4">
              外部APIからデータを取得する例
            </p>
            <div className="text-center">
              <button
                onClick={fetchUserData}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
              >
                {loading ? '読み込み中...' : 'ユーザーデータを取得'}
              </button>

              {user && (
                <div className="bg-orange-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-orange-800">取得したデータ：</h4>
                  <p><strong>名前:</strong> {user.name}</p>
                  <p><strong>メール:</strong> {user.email}</p>
                  <p><strong>電話:</strong> {user.phone}</p>
                  <p><strong>ウェブサイト:</strong> {user.website}</p>
                </div>
              )}
            </div>
          </div>

          {/* ウィンドウサイズ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              4. ウィンドウサイズの監視
            </h3>
            <p className="text-gray-600 mb-4">
              resizeイベントリスナーの例
            </p>
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  <strong>幅:</strong> {windowSize.width}px
                </p>
                <p className="text-blue-800">
                  <strong>高さ:</strong> {windowSize.height}px
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  ウィンドウサイズを変更してみてください
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* コード例 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            useEffect の基本パターン
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                1. マウント時のみ実行（空の依存配列）
              </h3>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  console.log('コンポーネントがマウントされました');

  return () => {
    console.log('クリーンアップ');
  };
}, []); // 空の依存配列`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                2. 特定の値が変更されたときに実行
              </h3>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  console.log('countが変更されました:', count);
}, [count]); // countが変更されるたびに実行`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                3. 毎回実行（依存配列なし）
              </h3>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  console.log('毎回実行されます');
}); // 依存配列なし`}
              </pre>
            </div>
          </div>
        </div>

        {/* 注意点 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
            ⚠️ 注意点
          </h2>
          <ul className="space-y-2 text-yellow-700">
            <li>• <strong>無限ループ</strong>: 依存配列を正しく設定しないと無限ループが発生する可能性があります</li>
            <li>• <strong>クリーンアップ</strong>: タイマーやイベントリスナーは必ずクリーンアップしましょう</li>
            <li>• <strong>非同期処理</strong>: useEffect内で直接asyncを使用できません。内部で非同期関数を定義して呼び出します</li>
            <li>• <strong>依存配列</strong>: useEffect内で使用する値は依存配列に含めましょう</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
