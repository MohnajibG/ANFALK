import { useCallback, useEffect, useMemo, useState } from "react";

import { Search, UserRound, X } from "lucide-react";

import { getEmployees } from "../../api/employee.api";

import type { Employee } from "../../types/employee";

interface EmployeeAutocompleteProps {
  value?: Employee | null;

  onChange: (employee: Employee | null) => void;
}

const EmployeeAutocomplete = ({
  value,
  onChange,
}: EmployeeAutocompleteProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getEmployees({
        search,
        role: "employee",
        isActive: true,
        limit: 10,
      });

      setEmployees(data);
    } catch (error) {
      console.error("[EmployeeAutocomplete] loadEmployees:", error);

      setError("Impossible de charger les employés.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      loadEmployees();
    }, 300);

    return () => clearTimeout(timeout);
  }, [isOpen, loadEmployees]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();

        return fullName.includes(search.toLowerCase());
      }),
    [employees, search],
  );

  const handleSelect = (employee: Employee) => {
    onChange(employee);

    setSearch("");

    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);

    setSearch("");
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium">Employé</label>

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
          placeholder="Rechercher un employé..."
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
            filteredEmployees.map((employee) => (
              <button
                key={employee._id}
                type="button"
                onClick={() => handleSelect(employee)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/5"
              >
                <UserRound size={18} />

                <div>
                  <p className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </p>

                  {employee.speciality && (
                    <p className="text-sm opacity-70">{employee.speciality}</p>
                  )}
                </div>
              </button>
            ))}

          {!isLoading && !error && filteredEmployees.length === 0 && (
            <p className="p-4 text-sm">Aucun employé trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeAutocomplete;
