"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./OM_Modal.css";

interface OM_Modal_Props {
  show: boolean;
  onClose: () => void;
}

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
} as const;

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export default function OM_Modal({ show, onClose }: OM_Modal_Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    let rafId: number | null = null;

    const updateCardTransform = (
      offsetX: number,
      offsetY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      console.log('Mouse move:', { offsetX, offsetY });
      
      animationHandlers.updateCardTransform(
        offsetX,
        offsetY,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;

    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);
    
    wrap.addEventListener("pointerenter", pointerEnterHandler);
    wrap.addEventListener("pointermove", pointerMoveHandler);
    wrap.addEventListener("pointerleave", pointerLeaveHandler);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      wrap.removeEventListener("pointerenter", pointerEnterHandler);
      wrap.removeEventListener("pointermove", pointerMoveHandler);
      wrap.removeEventListener("pointerleave", pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsLoading(false);
      setAmount(0);
      
      const modalTimer = setTimeout(() => {
        setIsModalVisible(true);
        let currentAmount = 0;
        const targetAmount = 5;
        const increment = 0.3;
        const interval = setInterval(() => {
          currentAmount += increment;
          if (currentAmount >= targetAmount) {
            currentAmount = targetAmount;
            clearInterval(interval);
          }
          setAmount(currentAmount);
        }, 40);
        
        return () => clearInterval(interval);
      }, 50);
      
      return () => clearTimeout(modalTimer);
    }
  }, [show]);

  const handleClose = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 200);
    }, 400);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-black/80 via-teal-900/20 to-green-900/20 backdrop-blur-md transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {}}
      />
      
      <div
        ref={wrapRef}
        className={`om-card-wrapper mx-4 my-12 transition-all duration-500 ease-out ${
          isModalVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-90 opacity-0 translate-y-4'
        }`}
        style={{
          "--pointer-x": "50%",
          "--pointer-y": "50%",
          "--pointer-from-center": "0",
          "--pointer-from-top": "0.5",
          "--pointer-from-left": "0.5",
          "--card-opacity": "0",
          "--rotate-x": "0deg",
          "--rotate-y": "0deg",
          "--background-x": "50%",
          "--background-y": "50%",
          "--behind-gradient": "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(160,100%,90%,var(--card-opacity)) 4%,hsla(160,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(160,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(160,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#00ffaaff 0%,#07c6ffff 40%,#07c6ffff 60%,#00ffaaff 100%)",
          "--inner-gradient": "linear-gradient(145deg,#0d9488 0%,#14b8a6 50%,#0d9488 100%)",
        } as React.CSSProperties}
      >
        <section ref={cardRef} className="om-card">
          <div className="om-inside">
            <div className="om-shine" />
            <div className="om-glare" />
            
            <div className="om-content">
              <div className="om-details">
                <h3 className="text-xs font-bold text-white mb-3 text-center">
                  Bienvenid@ a la colaboración LUMEN x OXYGEN
                </h3>
                
                <div className="space-y-3 text-white text-center">
                  <p className="text-xs" style={{ fontSize: '12px !important' }}>
                    Por haber ido a la fiesta y registrarte, ya tenés <span className="font-bold text-xs" style={{ fontSize: '12px !important' }}>{amount.toFixed(1)} tokens OM</span> en tu cuenta.
                  </p>
                  
                  <p className="text-xs font-semibold" style={{ fontSize: '12px !important' }}>¿Y eso qué significa?</p>
                  
                  <div className="space-y-2 text-xs leading-relaxed">
                    <p style={{ fontSize: '12px !important' }}>Cada OM representa 1 m² real de bosque protegido en La Florencia, Formosa. Es tu pedacito de Naturaleza. Literal.</p>
                    <p style={{ fontSize: '12px !important' }}>Ese bosque absorbe CO₂ y genera bonos de carbono (tokens OC). Con el tiempo, vas acumulando OC que podés cambiar por USDT (dólares digitales).</p>
                  </div>
                  
                  <p className="font-semibold text-xs mt-4" style={{ fontSize: '12px !important' }}>
                    En resumen: bailaste, salvaste bosque, y empezaste a ganar.
                  </p>
                </div>
                
                <button
                  onClick={handleClose}
                  className="om-contact-btn mt-6"
                >
                  Seguí el tour por tu Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}