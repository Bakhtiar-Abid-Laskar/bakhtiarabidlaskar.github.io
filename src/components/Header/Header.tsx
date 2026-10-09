'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import profile from '@/content/profile';
import { getLenis } from '@/motion/registry';
import styles from './Header.module.css';

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Work',    href: '#projects',        id: 'projects' },
  { label: 'About',   href: '#about',            id: 'about' },
  { label: 'Skills',  href: '#education-skills', id: 'education-skills' },
  { label: 'Contact', href: '#contact',          id: 'contact' },
];

export interface HeaderProps {
  onNavigate?: (targetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection for border reveal
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const currentId = visible[0].target.id;
          setActiveId(currentId === 'hero' ? '' : currentId);
        }
      },
      { rootMargin: '-80px 0px -40% 0px', threshold: [0.1, 0.3, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(targetId);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
      if (window.history?.pushState) {
        window.history.pushState(null, '', `#${targetId}`);
      }
      if (isMobileOpen) {
        setIsMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    },
    [isMobileOpen, onNavigate]
  );

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileOpen) return;
    closeBtnRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusables = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Lock scroll (body + Lenis) when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      const lenis = getLenis();
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      const lenis = getLenis();
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      const lenis = getLenis();
      lenis?.start();
    };
  }, [isMobileOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand link */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className={styles.brand}
          aria-label={`${profile.name} — back to top`}
        >
          <span className={styles.brandName}>{profile.name}</span>
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
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && <span className={styles.activeDot} aria-hidden="true" />}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Availability pill */}
        <div className={styles.availability} aria-label="Available for work">
          <span className={styles.availabilityDot} aria-hidden="true" />
          <span className={styles.availabilityText}>Available</span>
        </div>

        {/* Mobile Toggle */}
        <button
          id="nav-mobile-toggle"
          ref={toggleBtnRef}
          type="button"
          className={styles.mobileToggle}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-nav-dialog"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMobileOpen(true)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          id="mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          ref={mobileMenuRef}
          className={styles.mobileOverlay}
        >
          <div className={styles.mobileInner}>
            <div className={styles.mobileTop}>
              <span className={styles.brandName} aria-hidden="true">{profile.name}</span>
              <button
                id="nav-mobile-close"
                ref={closeBtnRef}
                type="button"
                className={styles.closeBtn}
                onClick={() => { setIsMobileOpen(false); toggleBtnRef.current?.focus(); }}
                aria-label="Close navigation menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile Navigation">
              <ul className={styles.mobileNavList}>
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id} style={{ '--item-index': i } as React.CSSProperties}>
                      <a
                        id={`nav-mobile-link-${item.id}`}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.id)}
                        className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className={styles.mobileNavIndex}>{String(i + 1).padStart(2, '0')}</span>
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={styles.mobileFooter}>
              <a href={`mailto:${profile.contact.email}`} className={styles.mobileContactLink}>
                {profile.contact.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;