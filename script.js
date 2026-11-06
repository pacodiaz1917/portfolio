/**
 * Portfolio - Pape Makhoudia Dieng
 * Interactivité, filtres dynamiques et navigation moderne
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Gestion du Menu Mobile (Hamburger) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburgerBtn && mobileDrawer) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = hamburgerBtn.classList.toggle('open');
            mobileDrawer.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 2. Surbrillance des liens de navigation au scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- 3. Filtrage dynamique des projets ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Changer le bouton actif
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        card.animate([
                            { opacity: 0, transform: 'scale(0.96) translateY(10px)' },
                            { opacity: 1, transform: 'scale(1) translateY(0)' }
                        ], {
                            duration: 250,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                            fill: 'forwards'
                        });
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 4. Bouton Retour en Haut de Page ---
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 5. Gestion du Formulaire de Contact (Envoi direct en temps réel à pdieng909@gmail.com) ---
    const contactForm = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && feedbackBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!nom || !email || !message) {
                feedbackBox.className = 'form-feedback error';
                feedbackBox.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
                return;
            }

            // Bouton en état de chargement dynamique
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg style="animation: spin 1s linear infinite; margin-right: 6px;" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                </svg>
                <span>Envoi en cours...</span>
            `;

            const formData = new FormData(contactForm);

            // Envoi réel en temps réel vers pdieng909@gmail.com via FormSubmit AJAX
            fetch("https://formsubmit.co/ajax/pdieng909@gmail.com", {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                feedbackBox.className = 'form-feedback success';
                feedbackBox.innerHTML = `
                    <strong>✓ Message transmis avec succès !</strong><br>
                    Merci <strong>${nom}</strong>, votre message a bien été envoyé en temps réel à <strong>pdieng909@gmail.com</strong>.<br>
                    <span style="font-size: 0.85em; opacity: 0.9;">Une réponse vous sera apportée dans les plus brefs délais. Vous pouvez aussi me joindre directement sur <a href="https://wa.me/221785513676" target="_blank" style="text-decoration: underline; color: inherit; font-weight: 600;">WhatsApp (+221 78 551 36 76)</a>.</span>
                `;
                contactForm.reset();
            })
            .catch(error => {
                // Secours en cas de souci réseau : ouverture du client mail
                feedbackBox.className = 'form-feedback success';
                feedbackBox.innerHTML = `
                    <strong>✓ Enregistré !</strong> Si l'envoi direct est bloqué par votre navigateur, vous pouvez envoyer votre message en un clic :<br>
                    <a href="mailto:pdieng909@gmail.com?subject=Contact%20Portfolio&body=${encodeURIComponent("Nom: " + nom + "\nEmail: " + email + "\n\nMessage:\n" + message)}" style="display:inline-block; margin-top: 6px; padding: 4px 10px; background: rgba(255,255,255,0.15); border-radius: 4px; text-decoration: underline; color: inherit;">Ouvrir l'email</a>
                    ou sur <a href="https://wa.me/221785513676" target="_blank" style="text-decoration: underline; color: inherit; font-weight: 600;">WhatsApp</a>.
                `;
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            });
        });
    }

    // --- 6. Copie rapide de l'email au clic ---
    const emailLink = document.getElementById('email-text');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('pdieng909@gmail.com').then(() => {
                    const originalText = emailLink.textContent;
                    emailLink.textContent = '✓ Email copié !';
                    setTimeout(() => {
                        emailLink.textContent = originalText;
                    }, 2000);
                });
            }
        });
    }

});
