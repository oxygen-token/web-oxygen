"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import "./Welcome_Modal.css";

interface Welcome_Modal_Props {
  show: boolean;
  onClose: () => void;
  onButtonClick: () => void;
}

export default function Welcome_Modal({ show, onClose, onButtonClick }: Welcome_Modal_Props) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("WelcomeModal");

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      
      // Crear y agregar el modal directamente al body
      const modalElement = document.createElement('div');
      modalElement.id = 'welcome-modal-portal';
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
        padding: 2rem 2.5rem;
        max-width: 32rem;
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
      
      // Contenido del modal
      modalContent.innerHTML = `
        <div style="text-align: center; color: white;">
          <!-- Logo Oxygen -->
          <div style="margin-bottom: 2rem; text-align: center;">
            <img src="/assets/images/logo_slogan.png" alt="Oxygen" style="height: 5rem; width: auto; margin-bottom: 0; display: inline-block;" />
          </div>
          
          <!-- Descripción -->
          <div style="text-align: left; margin-bottom: 2rem; line-height: 1.6;">
            <p style="margin-bottom: 1rem; color: rgba(255, 255, 255, 0.9);">
              ${t("description1")}
            </p>
            <p style="margin-bottom: 1rem; color: rgba(255, 255, 255, 0.9);">
              ${t("description2")}
            </p>
            <p style="color: rgba(255, 255, 255, 0.9);">
              ${t("description3")}
            </p>
          </div>
          
          <!-- Botón -->
          <button id="welcome-modal-button" style="
            background: linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%);
            border: 2px solid rgba(0, 202, 166, 0.8);
            border-radius: 0.75rem;
            padding: 0.875rem 2rem;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1);
            width: 100%;
            max-width: 16rem;
          ">
            ${t("cta")}
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
      const button = modalContent.querySelector('#welcome-modal-button');
      if (button) {
        button.addEventListener('click', onButtonClick);
        
        // Efecto hover
        button.addEventListener('mouseenter', () => {
          button.style.background = 'linear-gradient(135deg, rgba(3, 77, 77, 0.95) 0%, rgba(0, 106, 106, 0.9) 100%)';
          button.style.borderColor = 'rgba(0, 202, 166, 0.9)';
          button.style.transform = 'scale(1.02)';
          button.style.boxShadow = '0 12px 48px rgba(3, 77, 77, 0.6), inset 0 3px 10px rgba(255, 255, 255, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.background = 'linear-gradient(135deg, rgba(3, 77, 77, 0.9) 0%, rgba(0, 106, 106, 0.85) 100%)';
          button.style.borderColor = 'rgba(0, 202, 166, 0.8)';
          button.style.transform = 'scale(1)';
          button.style.boxShadow = '0 8px 32px rgba(3, 77, 77, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.1)';
        });
      }
      
      // Cerrar al hacer click afuera
      backdrop.addEventListener('click', onClose);
      
      modalRef.current = modalElement;
      
    } else {
      // Animar salida del modal antes de removerlo
      if (modalRef.current) {
        const backdrop = modalRef.current.querySelector('div:first-child');
        const modalContent = modalRef.current.querySelector('div:last-child');
        
        if (backdrop && modalContent) {
          backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          backdrop.style.backdropFilter = 'blur(0px)';
          modalContent.style.transform = 'scale(0.9) translateY(20px)';
          modalContent.style.opacity = '0';
          
          setTimeout(() => {
            if (modalRef.current) {
              document.body.removeChild(modalRef.current);
              modalRef.current = null;
            }
            document.body.style.overflow = '';
            setIsVisible(false);
          }, 400);
        }
      }
    }
  }, [show, onClose, onButtonClick, t]);

  return null;
}
