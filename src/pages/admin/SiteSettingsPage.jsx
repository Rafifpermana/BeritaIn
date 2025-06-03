// src/pages/admin/SiteSettingsPage.jsx
import React from "react";
import { Settings2 } from "lucide-react";

const SiteSettingsPage = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6 pb-4 border-b">
        <Settings2 size={28} className="text-gray-700 mr-3" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Pengaturan Situs
        </h1>
      </div>
      <p className="text-gray-600">
        Halaman ini akan berisi berbagai pengaturan umum untuk situs web,
        seperti nama situs, deskripsi, integrasi, dll. Fitur ini belum
        diimplementasikan.
      </p>
      {/* Contoh Form Placeholder */}
      <form className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="siteName"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Situs
          </label>
          <input
            type="text"
            name="siteName"
            id="siteName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="BeritaIn Keren"
          />
        </div>
        <div>
          <label
            htmlFor="siteDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Deskripsi Situs
          </label>
          <textarea
            name="siteDescription"
            id="siteDescription"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="Deskripsi singkat tentang situs Anda"
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700"
        >
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};
export default SiteSettingsPage;
