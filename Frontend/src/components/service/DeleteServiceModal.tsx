import { X, Trash2 } from "lucide-react";

import type { Service } from "../../types/service";

interface Props {
  service: Service;

  loading?: boolean;

  onConfirm: () => void;

  onClose: () => void;
}

export default function DeleteServiceModal({
  service,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
    "
    >
      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        bg-white
        p-8
        shadow-xl
      "
      >
        <div
          className="
          flex
          items-center
          justify-between
        "
        >
          <h2
            className="
            font-serif
            text-2xl
            font-bold
          "
          >
            Delete Service
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-full
              p-2
              hover:bg-gray-100
            "
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="
          mt-6
          rounded-2xl
          bg-red-50
          p-5
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            text-red-600
          "
          >
            <Trash2 size={22} />

            <p className="font-semibold">Are you sure?</p>
          </div>

          <p
            className="
            mt-3
            text-sm
            text-gray-600
          "
          >
            You are about to delete:
          </p>

          <p
            className="
            mt-1
            font-bold
          "
          >
            {service.name}
          </p>
        </div>

        <div
          className="
          mt-6
          flex
          gap-3
        "
        >
          <button
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              py-3
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="
              flex-1
              rounded-xl
              bg-red-600
              py-3
              text-white
              disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
