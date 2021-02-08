import { useState, useEffect } from "react";

const defaultParse = (data) => data;

const useStorage = (initialValue, key, parse = defaultParse) => {
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

  return [value, setValue];
};

export default useStorage;
