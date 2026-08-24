import React from "react"
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils"

// Vendorizado desde 21st.dev (Magic UI, by Dillion Verma — magicui.design)
// via `npx shadcn add @magicui/shiny-button`, con dos ajustes propios:
// 1) `as` para poder usarlo como <a>/<Link> ademas de <button> (el
//    original solo renderizaba motion.button).
// 2) Bajo movimiento reducido no corre la animacion — es un shine en
//    loop infinito (repeat: Infinity), justo el tipo de movimiento
//    continuo que esa preferencia pide evitar, y ademas cae en el mismo
//    problema de transform/opacity via WAAPI que se documento en
//    Reveal.jsx: se queda pegado en scale:0.8 en vez de saltar a 1.
const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
}

export const ShinyButton = React.forwardRef(
  ({ as: Tag = "button", children, className, textClassName, ...props }, ref) => {
  const reduceMotion = useReducedMotion();
  // motion.create() acepta tanto tags nativos ("a", "button") como
  // componentes propios (react-router <Link>) — asi el CTA puede seguir
  // siendo un Link real con viewTransition, no solo un <button>.
  const MotionTag = React.useMemo(() => motion.create(Tag), [Tag]);

  const sharedClassName = cn(
    "relative cursor-pointer rounded-lg border px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/10%_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_var(--primary)/10%]",
    className
  );
  // El span interno trae su propio color hardcodeado (incluida una
  // variante dark: con mas especificidad que cualquier override por
  // selector descendiente desde afuera) — se pasa como prop en vez de
  // pelear esa especificidad.
  const spanClassName = cn(
    "relative block size-full text-sm tracking-wide uppercase",
    textClassName || "text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]"
  );

  if (reduceMotion) {
    return (
      <Tag ref={ref} className={sharedClassName} {...props}>
        <span className={spanClassName}>
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <MotionTag ref={ref} className={sharedClassName} {...animationProps} {...props}>
      <span
        className={spanClassName}
        style={{
          maskImage:
            "linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
        }}>
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          WebkitMask:
            "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          backgroundImage:
            "linear-gradient(-75deg,var(--primary)/10% calc(var(--x)+20%),var(--primary)/50% calc(var(--x)+25%),var(--primary)/10% calc(var(--x)+100%))",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] p-px" />
    </MotionTag>
  );
})

ShinyButton.displayName = "ShinyButton"
