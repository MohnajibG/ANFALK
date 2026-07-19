import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserRound, X, Scissors } from "lucide-react";

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
      console.error("[EmployeeAutocomplete]", error);

      setError("Impossible de charger les employés.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen, loadEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      return fullName.includes(search.toLowerCase());
    });
  }, [employees, search]);

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
    <div className="relative flex flex-col gap-2">
      <label
        className="
          text-sm
          font-semibold
          text-(--black)
        "
      >
        Employé
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
          placeholder="Rechercher un employé..."
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

      {/* LISTE */}

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
              Recherche des employés...
            </p>
          )}

          {error && (
            <p
              className="
                bg-red-50
                p-5
                text-sm
                text-red-700
              "
            >
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            filteredEmployees.map((employee) => (
              <button
                key={employee._id}
                type="button"
                onClick={() => handleSelect(employee)}
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

                <div className="flex flex-col">
                  <p
                    className="
                    font-semibold
                    text-(--black)
                  "
                  >
                    {employee.firstName} {employee.lastName}
                  </p>

                  {employee.speciality && (
                    <div
                      className="
                      mt-1
                      flex
                      items-center
                      gap-1
                      text-xs
                      text-stone-500
                    "
                    >
                      <Scissors size={13} />

                      {employee.speciality}
                    </div>
                  )}
                </div>
              </button>
            ))}

          {!isLoading && !error && filteredEmployees.length === 0 && (
            <p
              className="
                p-5
                text-sm
                text-stone-500
              "
            >
              Aucun employé trouvé.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeAutocomplete;
