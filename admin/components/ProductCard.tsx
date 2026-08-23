type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

type Props = {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ProductCard({
    product,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">

            <div className="flex gap-5">

                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                />

                <div>
                    <h2 className="font-bold text-xl">
                        {product.name}
                    </h2>

                    <p className="text-gray-500">
                        {product.description}
                    </p>

                    <p className="font-bold mt-3">
                        ₺{product.price}
                    </p>
                </div>

            </div>

            <div className="flex gap-3">

                <button
                    onClick={onEdit}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Delete
                </button>

            </div>

        </div>
    );
}