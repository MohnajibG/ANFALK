import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserRound, X } from "lucide-react";

import { getClients } from "../../api/client.api";

import type { Client } from "../../types/client";

interface ClientAutocompleteProps {
  value?: Client | null;
  onChange: (client: Client | null) => void;
}

const ClientAutocomplete = ({ value, onChange }: ClientAutocompleteProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getClients({
        search,
        limit: 10,
      });

      setClients(data);
    } catch (error) {
      console.error("[ClientAutocomplete]", error);

      setError("Impossible de charger les clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      loadClients();
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen, loadClients]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const name = `${client.firstName} ${client.lastName}`.toLowerCase();

      return name.includes(search.toLowerCase());
    });
  }, [clients, search]);

  const handleSelect = (client: Client) => {
    onChange(client);

    setSearch("");

    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);

    setSearch("");
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label
        className="
          text-sm
          font-semibold
          text-(--black)
        "
      >
        Cliente
      </label>

      {/* INPUT */}

      <div className="relative">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-(--champagne)
          "
        />

        <input
          value={value ? `${value.firstName} ${value.lastName}` : search}
          onChange={(event) => {
            setSearch(event.target.value);

            setIsOpen(true);

            if (value) {
              onChange(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher une cliente..."
          className="
            h-12
            w-full
            rounded-2xl
            border border-(--border)
            bg-white
            pl-11
            pr-12
            outline-none
            transition
            focus:border-(--black)
          "
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-(--cream)
            "
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}

      {isOpen && (
        <div
          className="
            absolute
            top-full
            z-30
            mt-2
            flex
            max-h-72
            w-full
            flex-col
            overflow-hidden
            rounded-3xl
            border border-(--border)
            bg-white
            shadow-xl
          "
        >
          {isLoading && (
            <p
              className="
                p-5
                text-sm
                text-stone-500
              "
            >
              Recherche des clientes...
            </p>
          )}

          {error && (
            <p
              className="
                p-5
                text-sm
                text-red-700
                bg-red-50
              "
            >
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            filteredClients.map((client) => (
              <button
                key={client._id}
                type="button"
                onClick={() => handleSelect(client)}
                className="
                flex
                items-center
                gap-4
                border-b
                border-(--border)
                px-5
                py-4
                text-left
                transition
                hover:bg-(--cream)
              "
              >
                <div
                  className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-(--cream)
                  text-(--black)
                "
                >
                  <UserRound size={18} />
                </div>

                <div>
                  <p
                    className="
                    font-semibold
                    text-(--black)
                  "
                  >
                    {client.firstName} {client.lastName}
                  </p>

                  {client.phone && (
                    <p
                      className="
                      mt-1
                      text-xs
                      text-stone-500
                    "
                    >
                      {client.phone}
                    </p>
                  )}
                </div>
              </button>
            ))}

          {!isLoading && !error && filteredClients.length === 0 && (
            <p
              className="
                p-5
                text-sm
                text-stone-500
              "
            >
              Aucune cliente trouvée.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientAutocomplete;
