"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import "./OM_Modal.css";

interface OM_Modal_Props {
  show: boolean;
  onClose: () => void;
  onButtonClick: () => void;
}

export default function OM_Modal({ show, onClose, onButtonClick }: OM_Modal_Props) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("AffiliateSuccessBanner");

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      
      // Crear y agregar el modal directamente al body
      const modalElement = document.createElement('div');
      modalElement.id = 'om-modal-portal';
      modalElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      `;
      
      // Crear el backdrop
      const backdrop = document.createElement('div');
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0);
        backdrop-filter: blur(0px);
        z-index: 9999;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      // Crear el modal
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        position: relative;
        background: linear-gradient(135deg, rgba(0, 106, 106, 0.75) 0%, rgba(0, 202, 166, 0.65) 30%, rgba(1, 33, 56, 0.7) 70%, rgba(11, 136, 153, 0.8) 100%);
        backdrop-filter: blur(30px);
        border: 2px solid rgba(0, 202, 166, 0.8);
        border-radius: 1rem;
        padding: 1.5rem 2rem;
        max-width: 28rem;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 8px rgba(255, 255, 255, 0.3);
        transform: scale(0.9) translateY(20px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        margin: -1.5rem 0;
      `;
      
      // Agregar contenido del modal
              modalContent.innerHTML = `
          <div style="text-align: center; color: white;">
            <div style="margin-bottom: 1.5rem;">
              <div class="logo-container">
                <img src="/assets/images/oxygen blanco.png" alt="Oxygen" style="height: 12rem; width: auto;">
                <img src="/assets/images/lumensonus_logo-12.png" alt="Lumen Sonus" style="height: 4rem; width: auto;">
              </div>
              <h2 style="font-size: 1.125rem; font-weight: bold; line-height: 1.25; margin-bottom: 1.5rem;">
                ${t("headline")}
              </h2>
            </div>
            
            <div style="margin-bottom: 1.5rem; text-align: left;">
              <p style="font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem;">
                ${t("explanation")}
              </p>
              <p style="font-weight: 600; font-size: 0.875rem; margin-bottom: 1.5rem;">
                ${t("summary")}
              </p>
            </div>

          <button id="om-modal-button" style="
            width: 100%;
            position: relative;
            display: inline-block;
            border-radius: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            padding: 3px 0;
          ">
            <div style="
              position: relative;
              border: 2px solid rgba(0, 202, 166, 0.8);
              color: white;
              text-align: center;
              font-size: 16px;
              padding: 16px 26px;
              border-radius: 20px;
              transition: all 0.3s ease;
              background: linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%);
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1);
            ">
              <div style="line-height: 1.25;">
                ${t("cta")}
              </div>
            </div>
          </button>
        </div>
      `;
      
      // Agregar elementos al DOM
      modalElement.appendChild(backdrop);
      modalElement.appendChild(modalContent);
      document.body.appendChild(modalElement);
      
      // Animar entrada del modal
      setTimeout(() => {
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        backdrop.style.backdropFilter = 'blur(4px)';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
      }, 10);
      
      // Agregar event listener al botón
      const button = modalContent.querySelector('#om-modal-button');
      if (button) {
        button.addEventListener('click', onButtonClick);
        
        // Efecto hover
        const buttonDiv = button.querySelector('div');
        if (buttonDiv) {
          button.addEventListener('mouseenter', () => {
            buttonDiv.style.background = 'linear-gradient(135deg, rgba(3, 77, 77, 0.95) 0%, rgba(0, 106, 106, 0.9) 100%)';
            buttonDiv.style.borderColor = 'rgba(0, 202, 166, 0.9)';
            buttonDiv.style.transform = 'scale(1.02)';
            buttonDiv.style.boxShadow = '0 10px 35px rgba(3, 77, 77, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.15)';
          });
          
          button.addEventListener('mouseleave', () => {
            buttonDiv.style.background = 'linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%)';
            buttonDiv.style.borderColor = 'rgba(0, 202, 166, 0.8)';
            buttonDiv.style.transform = 'scale(1)';
            buttonDiv.style.boxShadow = '0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1)';
          });
        }
      }
      
      // No cerrar al hacer click afuera - modal solo se cierra con el botón
      // backdrop.addEventListener('click', onClose);
      
      modalRef.current = modalElement;
      
    } else {
      // Animar salida del modal antes de removerlo
      if (modalRef.current) {
        const backdrop = modalRef.current.querySelector('div:first-child');
        const modal = modalRef.current.querySelector('div:last-child');
        
        if (backdrop && modal) {
          // Animar salida
          (backdrop as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0)';
          (backdrop as HTMLElement).style.backdropFilter = 'blur(0px)';
          (modal as HTMLElement).style.transform = 'scale(0.9) translateY(20px)';
          (modal as HTMLElement).style.opacity = '0';
          
          // Remover después de la animación
          setTimeout(() => {
            if (modalRef.current) {
              document.body.removeChild(modalRef.current);
              modalRef.current = null;
            }
          }, 400);
        } else {
          // Fallback si no se encuentran los elementos
          document.body.removeChild(modalRef.current);
          modalRef.current = null;
        }
      }
    }

    return () => {
      // Cleanup: remover modal si existe
      if (modalRef.current) {
        document.body.removeChild(modalRef.current);
        modalRef.current = null;
      }
      document.body.style.overflow = '';
    };
  }, [show, onClose, onButtonClick]);

  // No renderizar nada en el componente React
  return null;
}