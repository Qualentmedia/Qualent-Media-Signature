import { useMemo, useState } from 'react';

export function useSort<T>(rows: T[], initialKey: keyof T, initialDir: 'asc' | 'desc' = 'desc') {
  const [key, setKey] = useState<keyof T>(initialKey);
  const [dir, setDir] = useState<'asc' | 'desc'>(initialDir);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      let cmp: number;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, key, dir]);

  const toggle = (k: keyof T) => {
    if (k === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setKey(k);
      setDir('desc');
    }
  };

  return { sorted, key, dir, toggle };
}
