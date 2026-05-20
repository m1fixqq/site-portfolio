document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ОГРАНИЧЕНИЕ ДОСТУПА К ЛИЧНОМУ КАБИНЕТУ (ЗАДАЧА 3)
    // ==========================================
    const isAccountPage = window.location.pathname.includes('account.html');
    if (isAccountPage) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '404.html';
            return; 
        } else {
            const welcomeTitle = document.querySelector('.account-section__welcome');
            const storedUsername = localStorage.getItem('username');
            if (welcomeTitle && storedUsername) {
                welcomeTitle.textContent = `Привет, ${storedUsername}!`;
            }
        }
    }

    const logoutBtn = document.querySelector('.profile-card__logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }

    // ==========================================
    // ЛОГИКА МОБИЛЬНОГО МЕНЮ (БУРГЕР)
    // ==========================================
    const menuBtn = document.querySelector('.header__menu-btn');
    const navMenu = document.querySelector('.nav');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('nav_open');
            if (navMenu.classList.contains('nav_open')) {
                menuBtn.textContent = '[X]';
            } else {
                menuBtn.textContent = '[=]';
            }
        });
    }

    // ==========================================
    // ЭФФЕКТ ПЕЧАТАЮЩЕГОСЯ ТЕКСТА ДЛЯ ТЕРМИНАЛА
    // ==========================================
    const typeTextElement = document.querySelector('.promo__title');
    if (typeTextElement) {
        const originalText = typeTextElement.textContent.trim();
        typeTextElement.textContent = '';
        let index = 0;

        function typeWriter() {
            if (index < originalText.length) {
                typeTextElement.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 20); 
            }
        }
        typeWriter();
    }

    // ==========================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (FADE-IN)
    // ==========================================
    const scrollElements = document.querySelectorAll('.advantage-card, .service-card, .about__container');
    
    if (scrollElements.length > 0) {
        scrollElements.forEach(el => el.classList.add('fade-in-element'));

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
        };

        const displayScrollElement = (element) => {
            element.classList.add('fade-in-element_visible');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.15)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', () => { 
            handleScrollAnimation();
        });
        
        handleScrollAnimation();
    }

    // ==========================================
    // ПЕРЕКЛЮЧЕНИЕ ВХОД / РЕГИСТРАЦИЯ (ЗАДАЧА 4)
    // ==========================================
    let isLoginMode = false; 
    const toggleLink = document.getElementById('auth-toggle-link');
    const authTitle = document.getElementById('auth-title');
    const submitBtn = document.getElementById('submit-btn');
    const authFooterText = document.getElementById('auth-footer-text');
    const regOnlyGroups = document.querySelectorAll('.js-reg-only');
    const groupUsername = document.getElementById('group-username');

    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;

            document.querySelectorAll('.form__error-message').forEach(err => err.style.display = 'none');

            if (isLoginMode) {
                authTitle.textContent = 'Вход в актацию';
                submitBtn.textContent = 'Войти';
                authFooterText.innerHTML = 'Еще нет аккаунта? <a href="#" class="auth-section__link" id="auth-toggle-link">Зарегистрироваться</a>';
                
                regOnlyGroups.forEach(el => el.style.display = 'none');
                if (groupUsername) groupUsername.style.display = 'none';
            } else {
                authTitle.textContent = 'Создать аккаунт заказчика';
                submitBtn.textContent = 'Зарегистрироваться';
                authFooterText.innerHTML = 'Уже есть аккаунт? <a href="#" class="auth-section__link" id="auth-toggle-link">Войти</a>';
                
                regOnlyGroups.forEach(el => el.style.display = 'block');
                if (groupUsername) groupUsername.style.display = 'block';
            }

            const newToggleLink = document.getElementById('auth-toggle-link');
            if (newToggleLink) {
                newToggleLink.addEventListener('click', arguments.callee);
            }
        });
    }

    // ==========================================
    // ВАЛИДАЦИЯ ФОРМЫ И ПЕРЕНАПРАВЛЕНИЕ (ЗАДАЧА 2 & 4)
    // ==========================================
    const regForm = document.getElementById('registration-form');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            let isValid = true;

            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');
            const confirmPassInput = document.getElementById('confirm-password');
            const agreementCheckbox = document.getElementById('agreement');

            const emailError = document.getElementById('email-error');
            const passError = document.getElementById('password-error');
            const confirmPassError = document.getElementById('confirm-password-error');
            const agreementError = document.getElementById('agreement-error');

            document.querySelectorAll('.form__error-message').forEach(err => err.style.display = 'none');

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailError.textContent = 'Укажите корректный e-mail адрес.';
                emailError.style.display = 'block';
                isValid = false;
            }

            if (passInput.value.length < 6) {
                passError.textContent = 'Пароль должен быть не менее 6 символов.';
                passError.style.display = 'block';
                isValid = false;
            }

            if (!isLoginMode) {
                if (passInput.value !== confirmPassInput.value) {
                    confirmPassError.textContent = 'Пароли не совпадают.';
                    confirmPassError.style.display = 'block';
                    isValid = false;
                }

                if (!agreementCheckbox.checked) {
                    agreementError.textContent = 'Необходимо ваше согласие на обработку данных.';
                    agreementError.style.display = 'block';
                    isValid = false;
                }
            }

            if (isValid) {
                localStorage.setItem('isLoggedIn', 'true');
                let nameToDisplay = usernameInput && usernameInput.value.trim() ? usernameInput.value.trim() : emailInput.value.split('@')[0];
                localStorage.setItem('username', nameToDisplay);
                window.location.href = 'account.html';
            }
        });
    }

    // ==========================================
    // ДИНАМИЧЕСКАЯ ПОДГРУЗКА КАРТОЧЕК УСЛУГ (ЗАДАЧА 5)
    // ==========================================
    const loadMoreBtn = document.querySelector('.pagination__button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenCards = document.querySelectorAll('.service-card_hidden');
            
            hiddenCards.forEach(card => {
                card.classList.remove('service-card_hidden');
                // Если на сайте включена анимация появления при скролле, активируем карточку сразу
                if (card.classList.contains('fade-in-element')) {
                    card.classList.add('fade-in-element_visible');
                }
            });

            // Так как скрытых карточек больше не осталось, убираем кнопку пагинации
            loadMoreBtn.style.display = 'none';
        });
    }
});