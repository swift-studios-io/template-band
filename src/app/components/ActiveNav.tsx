"use client";

import { useState, useEffect } from "react";

const SECTION_IDS = ["home", "about", "tour", "streaming", "members", "videos", "gallery", "news"];

export default function ActiveNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;
    if (scrolled) {
      nav.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
      nav.style.borderBottomColor = "rgba(255, 255, 255, 0.1)";
    } else {
      nav.style.backgroundColor = "transparent";
      nav.style.borderBottomColor = "transparent";
    }
  }, [scrolled]);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#c41e1e';
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${activeSection}`;
      if (isActive) {
        link.style.color = primaryColor;
      } else {
        link.style.color = "";
      }
    });
  }, [activeSection]);

  return null;
}
