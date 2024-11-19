import React from 'react';

const accessories = [
  {
    id: 1,
    name: "Apple Magic Mouse 2",
    price: "1.450.000₫",
    oldPrice: "2.050.000₫",
    image: "https://example.com/magic-mouse.jpg",
  },
  {
    id: 2,
    name: "Túi chống sốc TOMTOC 360°",
    price: "750.000₫",
    oldPrice: "950.000₫",
    image: "https://example.com/tomtoc-bag.jpg",
  },
  {
    id: 3,
    name: "Bàn di chuột Apple Magic Trackpad 2",
    price: "3.350.000₫",
    oldPrice: "4.050.000₫",
    image: "https://example.com/magic-trackpad.jpg",
  },
  {
    id: 4,
    name: "Cổng chuyển HyperDrive USB-C Hub",
    price: "2.350.000₫",
    oldPrice: "2.950.000₫",
    image: "https://example.com/hyperdrive-hub.jpg",
  },
];

function AccessoriesPage() {
  return (
    <div className="bg-yellow-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Phụ kiện</h1>
      <div className="flex justify-center space-x-4 flex-wrap">
        {accessories.map((accessory) => (
          <div key={accessory.id} className="bg-white p-4 rounded-lg shadow-md w-64 mb-4">
            <img src={accessory.image} alt={accessory.name} className="w-32 h-32 mx-auto" />
            <h2 className="text-lg font-semibold mt-4">{accessory.name}</h2>
            <div className="text-blue-600 font-bold">{accessory.price}</div>
            <div className="text-gray-500 line-through">{accessory.oldPrice}</div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Xem tất cả phụ kiện &gt;</button>
      </div>
    </div>
  );
}
export default AccessoriesPage;
