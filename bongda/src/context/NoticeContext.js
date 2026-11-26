import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(() => {});

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text) => setNotice({ text }), []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      <div role="status" className="notice">
        {notice ? notice.text : ''}
      </div>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => useContext(NoticeContext);
