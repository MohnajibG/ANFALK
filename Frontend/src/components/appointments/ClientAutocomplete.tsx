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
      console.error("[ClientAutocomplete] loadClients:", error);

      setError("Impossible de charger les clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      loadClients();
    }, 300);

    return () => clearTimeout(timeout);
  }, [isOpen, loadClients]);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();

        return fullName.includes(search.toLowerCase());
      }),
    [clients, search],
  );

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
    <div className="relative">
      <label className="mb-2 block text-sm font-medium">Cliente</label>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
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
          className="w-full rounded-xl border px-10 py-3"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-lg">
          {isLoading && <p className="p-4 text-sm">Recherche...</p>}

          {error && <p className="p-4 text-sm text-red-500">{error}</p>}

          {!isLoading &&
            !error &&
            filteredClients.map((client) => (
              <button
                key={client._id}
                type="button"
                onClick={() => handleSelect(client)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/5"
              >
                <UserRound size={18} />

                <div>
                  <p className="font-medium">
                    {client.firstName} {client.lastName}
                  </p>

                  {client.phone && (
                    <p className="text-sm opacity-70">{client.phone}</p>
                  )}
                </div>
              </button>
            ))}

          {!isLoading && !error && filteredClients.length === 0 && (
            <p className="p-4 text-sm">Aucune cliente trouvée.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientAutocomplete;
