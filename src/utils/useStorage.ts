import { useState, useEffect } from "react";

type Parse = <TValue>(raw: any) => TValue;

const defaultParse: Parse = (data) => data;

const useStorage = <TValue>(
  initialValue: TValue,
  key: string,
  parse: Parse = defaultParse
) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const data = localStorage.getItem(key);
    if (data) {
      setValue(parse(JSON.parse(data)));
    }
  }, [key, parse]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, setValue, key]);

  return [value, setValue] as const;
};

export default useStorage;
