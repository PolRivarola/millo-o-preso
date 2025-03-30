# 🧠 Idea millonaria o Estafa piramidal

¿Tenés una idea de negocio revolucionaria... o estás a un paso de caer en una estafa piramidal?  
**Idea millonaria o Estafa piramidal** es una aplicación web que analiza tus ideas con inteligencia artificial y te dice, con humor e ironía, si estás por cambiar el mundo o fundar otro esquema dudoso.

---

## 🚀 Funcionalidades

- 🔐 **Login por Magic Link (sin contraseña)** vía Supabase Auth
- 💡 **Pegá tu idea** en un textarea estilizado
- 🤖 **Evaluación con IA** usando OpenRouter + LLMs (ej: Mistral)
- 💬 **Veredicto con humor**: MILLONARIA 💸 o PIRAMIDAL 🔺
- 🧑‍💻 **Gating visual**:
  - Usuarios **Free**: 1 idea por día
  - Usuarios **Pro**: uso ilimitado
- 💳 Página `/pro` con modal falso de pago (simulación estilo Stripe)
- 🖼️ UI moderna y responsive usando Tailwind + shadcn/ui
- ☁️ Deploy en Vercel

---

## 📦 Tecnologías

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/) (Auth y metadata de usuario)
- [OpenRouter](https://openrouter.ai/) (IA)
- [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

---
---

## Enfoque

Se buscó darle una sensación futurista a la pagina, pero que a la vez demuestre elegancia. Una UI simple permite al usuario desplazarse sin problema por las diferentes rutas.
No se buscó llenar al usuario de informacion. Simplemente presentar lo que el producto pueda hacer de manera rápida y conveniente.
Se utilizaron diferentes recursos como v0 de vercel y la documentación de Tailwind para alcanzar el estilo deseado de la página. 

---

---

## Problemas presentes

Actualmente los Magic Links de SupaBase son inconsistentes. Para algunos usuarios es necesario enviar este Magic Link una segunda vez para poder ingresar a la plataforma.

---
