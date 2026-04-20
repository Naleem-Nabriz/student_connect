import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const buttonSelector = '.motion-button, .motion-nav';
const cardSelector = '.motion-card';
const interactiveSelector = `${buttonSelector}, ${cardSelector}`;

const markMotionTargets = (root) => {
  if (!root) {
    return;
  }

  root.querySelectorAll('button, .btn-primary, a[class]').forEach((element) => {
    const isLikelyButton =
      element.tagName === 'BUTTON' ||
      element.className.includes('btn-primary') ||
      element.className.includes('rounded') ||
      element.className.includes('px-') ||
      element.className.includes('py-');

    if (isLikelyButton) {
      element.classList.add('motion-button');
    }
  });

  root.querySelectorAll('nav a, aside a, [aria-current="page"]').forEach((element) => {
    element.classList.add('motion-nav');
  });

  root.querySelectorAll('div[class*="shadow-"], section[class*="shadow-"], article[class*="shadow-"], .card-hover').forEach((element) => {
    if (!element.hasAttribute('data-route-shell')) {
      element.classList.add('motion-card');
    }
  });
};

const animateHoverIn = (element) => {
  const isCard = element.matches(cardSelector);

  gsap.killTweensOf(element);
  gsap.to(element, {
    y: isCard ? -6 : -3,
    scale: isCard ? 1.01 : 1.02,
    boxShadow: isCard
      ? '0 26px 48px rgba(44, 62, 80, 0.14)'
      : '0 20px 38px rgba(44, 62, 80, 0.14)',
    duration: 0.22,
    ease: 'power2.out',
  });
};

const animateHoverOut = (element) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    y: 0,
    scale: 1,
    boxShadow: '',
    duration: 0.22,
    ease: 'power2.out',
  });
};

const animatePressIn = (element) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 0.985,
    duration: 0.14,
    ease: 'power2.out',
  });
};

const animatePressOut = (element) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: element.matches(cardSelector) ? 1.01 : 1.02,
    duration: 0.16,
    ease: 'power2.out',
  });
};

const GlobalMotion = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const shell = document.querySelector('[data-route-shell]');

    markMotionTargets(shell || document.body);

    if (!shell) {
      return undefined;
    }

    const targets = Array.from(shell.children);
    const context = gsap.context(() => {
      gsap.fromTo(
        shell,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );

      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out', delay: 0.05 }
        );
      }
    }, shell);

    return () => context.revert();
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerOver = (event) => {
      const element = event.target.closest(interactiveSelector);
      if (!element || element.contains(event.relatedTarget)) {
        return;
      }

      animateHoverIn(element);
    };

    const handlePointerOut = (event) => {
      const element = event.target.closest(interactiveSelector);
      if (!element || element.contains(event.relatedTarget)) {
        return;
      }

      animateHoverOut(element);
    };

    const handlePointerDown = (event) => {
      const element = event.target.closest(buttonSelector);
      if (!element) {
        return;
      }

      animatePressIn(element);
    };

    const handlePointerUp = (event) => {
      const element = event.target.closest(buttonSelector);
      if (!element) {
        return;
      }

      animatePressOut(element);
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return null;
};

export default GlobalMotion;
