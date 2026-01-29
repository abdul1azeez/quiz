import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";

const BASE_URL =
  "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

const Searchbar = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  // expose focus() to parent (⌘K)
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  // search API (debounced)
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      `${BASE_URL}/search/global`,
      {
        params: { q: query, page: 0, size: 5 },
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
      }
    );

    setResults(res.data);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
}, 300);

return () => clearTimeout(timer);
  }, [query]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setResults(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* INPUT */}
      <div className="relative flex items-center w-full h-12 md:h-14 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-full shadow-sm px-4 md:px-5">
        <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base"
        />

        <div className="hidden md:flex pointer-events-none items-center gap-1 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-[10px] font-medium text-gray-400 opacity-60">
          <span className="text-xs">⌘</span>K
        </div>
      </div>

      {/* RESULTS */}
      {(results || loading) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {loading && (
            <div className="p-3 text-sm text-gray-400">
              Searching…
            </div>
          )}

          {results?.users?.content?.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400">
                USERS
              </div>
              {results.users.content.map((u) => (
                <NavLink
                  key={u.id}
                  to={`/profile/${u.handle}`}
                  onClick={() => setResults(null)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                >
                  <img
                    src={u.avatarUrl}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {u.displayName}
                    </p>
                    <p className="text-xs text-gray-400">
                      @{u.handle}
                    </p>
                  </div>
                </NavLink>
              ))}
            </>
          )}

          {results?.content?.content?.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400">
                POSTS
              </div>
              {results.content.content.map((p) => (
                <NavLink
                  key={p.id}
                  to={`/post/${p.id}`}
                  onClick={() => setResults(null)}
                  className="block px-3 py-2 hover:bg-gray-50"
                >
                  <p className="text-sm font-medium">
                    {p.title}
                  </p>
                </NavLink>
              ))}
            </>
          )}

          {results?.totalResults === 0 && !loading && (
            <div className="p-3 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Searchbar;
