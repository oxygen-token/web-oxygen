"use client";
import { useState } from "react";
import { PiInstagramLogo, PiLinkedinLogo } from "react-icons/pi";

export default function Edit_Profile_Form() {
  const [formData, setFormData] = useState({
    nombre: "Laura",
    apellido: "Alameda",
    mail: "almeda.laura@gmail.com",
    telefono: "011 3313 8191",
    contraseña: "***********",
    confirmarContraseña: "***********",
    instagram: "@l.alameda",
    linkedin: "laura-alameda"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20 flex flex-col max-w-[600px] max-h-[700px] mx-auto w-full overflow-y-auto">
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-6">
        Editar perfil
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Mail *
          </label>
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Contraseña *
          </label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Confirmar contraseña *
          </label>
          <input
            type="password"
            name="confirmarContraseña"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-white/90 text-sm font-medium block mb-4">
          Perfil social
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white/90 text-sm font-medium">
              Instagram
            </label>
            <div className="flex items-center bg-white/20 border border-white/30 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center p-3 border-r border-white/20">
                <PiInstagramLogo className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="flex-1 bg-transparent px-4 py-2 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/90 text-sm font-medium">
              LinkedIn
            </label>
            <div className="flex items-center bg-white/20 border border-white/30 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center p-3 border-r border-white/20">
                <PiLinkedinLogo className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="flex-1 bg-transparent px-4 py-2 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <button className="w-fit bg-white text-[#539390] rounded-lg px-6 py-3 font-semibold hover:bg-white/90 transition-colors">
          Actualizar info.
        </button>
      </div>
    </div>
  );
}

