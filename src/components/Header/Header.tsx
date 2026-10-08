'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import profile from '@/content/profile';
import styles from './Header.module.css';

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Education and skills', href: '#education-skills', id: 'education-skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export interface HeaderProps {
  onNavigate?: (targetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = ['hero', 'about', 'projects', 'education-skills', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible entries
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Sort by highest visible intersection ratio or position
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const currentId = visible[0].target.id;
          if (currentId !== 'hero') {
            setActiveId(currentId);
          } else {
            setActiveId('');
          }
        }
      },
      {
        rootMargin: '-70px 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      const hash = `#${targetId}`;

      if (onNavigate) {
        onNavigate(targetId);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }

      if (window.history?.pushState) {
        window.history.pushState(null, '', hash);
      }

      if (isMobileOpen) {
        setIsMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    },
    [isMobileOpen, onNavigate]
  );

  // Manage focus when mobile menu opens / closes
  useEffect(() => {
    if (isMobileOpen) {
      closeBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileOpen(false);
          toggleBtnRef.current?.focus();
          return;
        }

        // Focus trap inside mobileMenuRef
        if (e.key === 'Tab' && mobileMenuRef.current) {
          const focusables = mobileMenuRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className={styles.brand}
        >
          {profile.name}
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className={`${styles.navLink} ${
                      isActive ? styles.navLinkActive : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          ref={toggleBtnRef}
          type="button"
          className={styles.mobileToggle}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-nav-dialog"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileOpen(true)}
        >
          Menu
        </button>
      </div>

      {/* Accessible Mobile Menu Dialog */}
      {isMobileOpen && (
        <div
          id="mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          ref={mobileMenuRef}
          className={styles.mobileOverlay}
        >
          <div className={styles.mobileHeader}>
            <span className={styles.brand}>{profile.name}</span>
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.closeBtn}
              onClick={() => {
                setIsMobileOpen(false);
                toggleBtnRef.current?.focus();
              }}
              aria-label="Close navigation menu"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile Navigation">
            <ul className={styles.mobileNavList}>
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.id)}
                      className={`${styles.mobileNavLink} ${
                        isActive ? styles.mobileNavLinkActive : ''
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
