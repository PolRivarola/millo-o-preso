"use client";


type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  visible: boolean;
};

export default function FakeStripeModal({ onConfirm, onCancel, loading, visible }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full text-center z-50">

      <div className="flex gap-2 mb-4">
      <button className="w-1/2 bg-black text-white px-4 py-2 rounded">
        Apple Pay
      </button>
      <button className="w-1/2 bg-green-600 text-white px-4 py-2 rounded">
        Pay with Link
      </button>
    </div>


        <div className="border-t border-gray-300 my-2" />

        <form className="flex flex-col gap-3 text-left text-sm text-black">
          <label>
            Correo electrónico
            <input
              type="email"
              value="julia.perez@example.es"
              disabled
              className="w-full border rounded p-2 mt-1"
            />
          </label>

          <label>
            Información de la tarjeta
            <input
              type="text"
              value="1234 1234 1234 1234"
              disabled
              className="w-full border rounded p-2 mt-1"
            />
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value="12/34"
                disabled
                className="w-1/2 border rounded p-2"
              />
              <input
                type="text"
                value="123"
                disabled
                className="w-1/2 border rounded p-2"
              />
            </div>
          </label>

          <label>
            Nombre del titular de la tarjeta
            <input
              type="text"
              value="Julia Pérez Sánchez"
              disabled
              className="w-full border rounded p-2 mt-1"
            />
          </label>

          <label>
            País o región
            <select disabled className="w-full border rounded p-2 mt-1">
              <option>Spain</option>
            </select>
          </label>
        </form>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-6 w-full"
        >
          {loading ? "Procesando..." : "Pagar 0,00 €"}
        </button>

        <button
          onClick={onCancel}
          className="mt-3 text-sm text-gray-500 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
