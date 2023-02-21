import { useEffect, useState } from "react";
import useSWR from "swr";

function useFetch(url) {
  const [data, setData] = useState();

  useEffect(() => {
    async function startFetching() {
      const response = await fetch(url);
      const newData = await response.json();

      setData(newData);
    }

    startFetching();
  }, [url]);

  return data;
}

export default function Joke() {
  const [id, setId] = useState(0);
  const [jokesInfo, setJokesInfo] = useState([]);

  /*  const data = useFetch(`https://example-apis.vercel.app/api/bad-jokes/${id}`); */
  const { data } = useSWR(
    `https://example-apis.vercel.app/api/bad-jokes/${id}`
  );

  function handlePrevJoke() {
    setId(data.prevId);
  }

  function handleNextJoke() {
    setId(data.nextId);
  }

  function handleToggleFunny(id) {
    setJokesInfo((prevJokesInfo) => {
      const info = prevJokesInfo.find((info) => info.id === id);
      if (info) {
        return prevJokesInfo.map((info) =>
          info.id === id ? { ...info, isFunny: !info.isFunny } : info
        );
      }
      return [...prevJokesInfo, { id: id, isFunny: true }];
    });
  }

  if (!data) {
    return <h1>Loading...</h1>;
  }

  const info = jokesInfo.find((info) => info.id === id) ?? { isFunny: false };
  const { isFunny } = info;

  return (
    <>
      <small>ID: {id}</small>
      <h1>{data.joke}</h1>
      <span
        role="img"
        aria-label={isFunny ? "A laughing face" : "An unamused face"}
      >
        {isFunny ? "🤣" : "😒"}
      </span>
      <button type="button" onClick={() => handleToggleFunny(id)}>
        {isFunny ? "Stop laughing" : "Start laughing"}
      </button>
      <div>
        <button type="button" onClick={handlePrevJoke}>
          ← Prev Joke
        </button>
        <button type="button" onClick={handleNextJoke}>
          Next Joke →
        </button>
      </div>
    </>
  );
}
