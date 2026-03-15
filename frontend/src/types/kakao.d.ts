// Kakao JavaScript SDK 전역 타입 선언
interface Window {
  Kakao: {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Auth: {
      login: (options: {
        success: (authObj: { access_token: string }) => void;
        fail: (error: unknown) => void;
      }) => void;
    };
  };
}
