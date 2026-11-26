import { useEffect, useState } from 'react';

const INITIAL = { data: null, loading: true, error: null };

const useFetch = (url) => {
  const [state, setState] = useState(INITIAL);

  useEffect(() => {
    const controller = new AbortController();
    setState(INITIAL);

    const load = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setState({ data, loading: false, error: null });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setState({ data: null, loading: false, error: err.message });
      }
    };

    load();
    return () => controller.abort();
  }, [url]);

  return state;
};

export default useFetch;