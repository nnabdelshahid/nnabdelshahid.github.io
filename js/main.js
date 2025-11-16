/* ===================================================================
 * Ceevee 2.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";
    
    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';


   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        window.addEventListener('load', function() {
            
            document.querySelector('body').classList.remove('ss-preload');
            document.querySelector('body').classList.add('ss-loaded');

            preloader.addEventListener('transitionend', function(e) {
                if (e.target.matches("#preloader")) {
                    this.style.display = 'none';
                }
            });

        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


   /* Parallax
    * -------------------------------------------------- */
    const ssParallax = function() { 

        const rellax = new Rellax('.rellax');

    }; // end ssParallax


   /* Move header menu
    * -------------------------------------------------- */
    const ssMoveHeader = function () {

        const hdr = document.querySelector('.s-header');
        const hero = document.querySelector('#hero');
        let triggerHeight;

        if (!(hdr && hero)) return;

        setTimeout(function(){
            triggerHeight = hero.offsetHeight - 170;
        }, 300);

        window.addEventListener('scroll', function () {

            let loc = window.scrollY;
           

            if (loc > triggerHeight) {
                hdr.classList.add('sticky');
            } else {
                hdr.classList.remove('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.classList.add('offset');
            } else {
                hdr.classList.remove('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.classList.add('scrolling');
            } else {
                hdr.classList.remove('scrolling');
            }

        });

    }; // end ssMoveHeader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const headerNavWrap = document.querySelector('.s-header__nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && headerNavWrap)) return;

        toggleButton.addEventListener('click', function(event){
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        headerNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {
            link.addEventListener("click", function(evt) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },          
            breakpoints: {
                // when window width is >= 401px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is >= 801px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 48
                }
            }
         });

    }; // end ssSwiper


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-item a');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(evt) {
                            evt = evt || window.event;
                            if(evt.keyCode === 27){
                            instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box) {

            box.addEventListener('click', function(e){
                if (e.target.matches(".alert-box__close")) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add("hideit");

                    setTimeout(function() {
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssSmoothScroll = function () {
        
        const triggers = document.querySelectorAll(".smoothscroll");

        triggers.forEach(function(trigger) {
            trigger.addEventListener("click", function() {
                const target = trigger.getAttribute("href");

                Jump(target, {
                    duration: 1200,
                });
            });
        });

    }; // end ssSmoothScroll


   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop


   /* Theme Toggle (dark/light)
    * ------------------------------------------------------ */
    const ssThemeToggle = function() {
        const btn = document.getElementById('theme-toggle');
        const htmlEl = document.documentElement;
        if (!btn) return;

        const getPreferred = function() {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        };

        const applyTheme = function(mode) {
            htmlEl.setAttribute('data-theme', mode === 'light' ? 'light' : 'dark');
            const isDark = mode !== 'light';
            btn.setAttribute('aria-pressed', String(isDark));
            const icon = btn.querySelector('.theme-toggle__icon');
            if (icon) icon.textContent = isDark ? '🌙' : '☀️';
        };

        let current = getPreferred();
        applyTheme(current);

        btn.addEventListener('click', function(){
            current = (current === 'light') ? 'dark' : 'light';
            localStorage.setItem('theme', current);
            applyTheme(current);
        });
    }; // end ssThemeToggle


       /* Resume Import & Upload helpers
        * ------------------------------------------------------ */
        const getResumeContainers = function() {
            return {
                careerEl: document.getElementById('career-container'),
                educationEl: document.getElementById('education-container'),
                skillsListEl: document.getElementById('skills-list')
            };
        };

        const fmtRange = function(start, end) {
            const fmt = function(s){
                if(!s) return null;
                // Expecting YYYY or YYYY-MM
                const p = String(s).split('-');
                const months = ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const yy = p[0];
                const mm = p[1] ? months[parseInt(p[1],10)] : '';
                return yy + (mm ? ' ' + mm : '');
            };
            const a = fmt(start);
            const b = fmt(end) || 'Present';
            return (a ? a : '') + ((a || b) ? ' - ' : '') + (b ? b : '');
        };

        const renderProfile = function(profile) {
            const { careerEl, educationEl, skillsListEl } = getResumeContainers();
            if (!(careerEl && educationEl && skillsListEl)) return;

            // Experience
        // Case Studies
        const csContainer = document.getElementById('case-studies-container');
        if (csContainer && Array.isArray(profile.caseStudies)) {
            const csHTML = profile.caseStudies.map(function(cs){
                const header = (
                    '<div class="resume-block__header">' +
                        '<h4 class="h3">' + (cs.title || 'Case Study') + '</h4>' +
                        '<p class="resume-block__header-meta">' +
                            '<span>' + [cs.company, cs.role].filter(Boolean).join(' — ') + '</span>' +
                            '<span class="resume-block__header-date">' + fmtRange(cs.startDate, cs.endDate) + '</span>' +
                        '</p>' +
                    '</div>'
                );
                const list = (
                    '<ul class="disc">' +
                        (cs.problem ? '<li><strong>Problem:</strong> ' + cs.problem + '</li>' : '') +
                        (cs.approach ? '<li><strong>Approach:</strong> ' + cs.approach + '</li>' : '') +
                        (cs.impact ? '<li><strong>Impact:</strong> ' + cs.impact + '</li>' : '') +
                    '</ul>'
                );
                const link = cs.link ? '<p><a class="modal-popup__details" href="' + cs.link + '" target="_blank" rel="noopener">Read more</a></p>' : '';
                return '<div class="resume-block">' + header + list + link + '</div>';
            }).join('');
            if (csHTML) csContainer.innerHTML = csHTML;
        }

            if (Array.isArray(profile.experience)) {
                const expHTML = profile.experience.map(function(item){
                    return (
                        '<div class="resume-block">' +
                          '<div class="resume-block__header">' +
                            '<h4 class="h3">' + (item.company || '') + '</h4>' +
                            '<p class="resume-block__header-meta">' +
                              '<span>' + (item.title || '') + '</span>' +
                              '<span class="resume-block__header-date">' + fmtRange(item.startDate, item.endDate) + '</span>' +
                            '</p>' +
                          '</div>' +
                          (item.description ? '<p>' + item.description + '</p>' : '') +
                        '</div>'
                    );
                }).join('');
                careerEl.innerHTML = expHTML;
            }

            // Education
            if (Array.isArray(profile.education)) {
                const eduHTML = profile.education.map(function(item){
                    return (
                        '<div class="resume-block">' +
                          '<div class="resume-block__header">' +
                            '<h4 class="h3">' + (item.school || '') + '</h4>' +
                            '<p class="resume-block__header-meta">' +
                              '<span>' + (item.degree || '') + '</span>' +
                              '<span class="resume-block__header-date">' + fmtRange(item.startDate, item.endDate) + '</span>' +
                            '</p>' +
                          '</div>' +
                        '</div>'
                    );
                }).join('');
                educationEl.innerHTML = eduHTML;
            }

            // Skills
            if (skillsListEl) {
                const skills = Array.isArray(profile.skills) ? profile.skills : [];
                const items = skills.map(function(s){
                    const lvl = Math.max(5, Math.min(100, (typeof s.level === 'number' ? s.level : 75)));
                    const rounded = Math.round(lvl / 5) * 5; // match available CSS classes
                    const cls = 'percent' + rounded;
                    return (
                        '<li>' +
                          '<div class="progress ' + cls + '"></div>' +
                          '<strong>' + (s.name || '') + '</strong>' +
                        '</li>'
                    );
                }).join('');
                if (items) skillsListEl.innerHTML = items;
            }
        };

       /* Resume Import (from data/profile.json)
        * ------------------------------------------------------ */
        const ssResumeImport = function() {
            const containers = getResumeContainers();
            if (!(containers.careerEl && containers.educationEl && containers.skillsListEl)) return;

            fetch('data/profile.json', { cache: 'no-store' })
                .then(function(res) { if (!res.ok) throw new Error('No profile.json'); return res.json(); })
                .then(function(profile) { renderProfile(profile); })
                .catch(function(){ /* profile.json optional; ignore if missing */ });

        }; // end ssResumeImport

       /* Resume Upload UI (LinkedIn export or site profile.json)
        * ------------------------------------------------------ */
        const ssResumeUpload = function() {
            const fileInput = document.getElementById('resume-file-input');
            const importBtn = document.getElementById('resume-import-btn');
            const downloadBtn = document.getElementById('resume-download-btn');
            const statusEl = document.getElementById('resume-import-status');
            if (!(fileInput && importBtn && downloadBtn && statusEl)) return;

            let mappedProfileCache = null;

            const setStatus = function(msg) {
                statusEl.textContent = msg || '';
            };

            const pad2 = function(n){ return (n < 10 ? '0' : '') + n; };
            const toYYYYMM = function(obj){
                if (!obj || !obj.year) return null;
                const y = String(obj.year);
                const m = obj.month ? pad2(parseInt(obj.month,10)) : null;
                return m ? (y + '-' + m) : y;
            };

            const findArrayByKey = function(obj, keys) {
                const stack = [obj];
                const keyset = keys.map(function(k){return k.toLowerCase();});
                while (stack.length) {
                    const cur = stack.pop();
                    if (cur && typeof cur === 'object') {
                        for (var k in cur) {
                            if (!Object.prototype.hasOwnProperty.call(cur, k)) continue;
                            const v = cur[k];
                            if (Array.isArray(v) && keyset.indexOf(k.toLowerCase()) !== -1) return v;
                            if (v && typeof v === 'object') stack.push(v);
                        }
                    }
                }
                return null;
            };

            const mapLinkedInToProfile = function(data) {
                // Try to locate arrays within arbitrary LinkedIn JSON
                const positions = findArrayByKey(data, ['positions', 'experience', 'positionsV2']) || [];
                const educations = findArrayByKey(data, ['educations', 'education']) || [];
                const skillsArr = findArrayByKey(data, ['skills', 'skillsV2']) || [];

                const experience = positions.map(function(p){
                    var company = p.companyName || (p.company && (p.company.name || p.company.localizedName)) || '';
                    var title = p.title || p.designation || '';
                    var tp = p.timePeriod || p.date || {};
                    var start = toYYYYMM(tp.startDate || tp.start || {});
                    var end = toYYYYMM(tp.endDate || tp.end || {}) || null;
                    var location = p.locationName || (p.location && (p.location.name || p.location.geoLocationName)) || '';
                    var description = p.description || p.summary || '';
                    return { company: company, title: title, startDate: start, endDate: end, location: location, description: description };
                });

                const education = educations.map(function(e){
                    var school = e.schoolName || (e.school && (e.school.name || e.school.localizedName)) || '';
                    var degree = e.degreeName || e.degree || '';
                    var tp = e.timePeriod || e.date || {};
                    var start = toYYYYMM(tp.startDate || tp.start || {});
                    var end = toYYYYMM(tp.endDate || tp.end || {});
                    return { school: school, degree: degree, startDate: start, endDate: end };
                });

                const skills = skillsArr.map(function(s){
                    if (typeof s === 'string') return { name: s, level: 75 };
                    var name = s.name || s.localizedName || s.skill || '';
                    return { name: name, level: 75 };
                });

                return { experience: experience, education: education, skills: skills };
            };

            importBtn.addEventListener('click', function(){
                setStatus('');
                const file = fileInput.files && fileInput.files[0];
                if (!file) { setStatus('Please choose a JSON file first.'); return; }
                const reader = new FileReader();
                reader.onerror = function(){ setStatus('Could not read the file.'); };
                reader.onload = function(evt){
                    try {
                        const json = JSON.parse(String(evt.target.result));
                        // Detect profile format
                        let profile;
                        if (json && (Array.isArray(json.experience) || Array.isArray(json.education) || Array.isArray(json.skills))) {
                            profile = json; // already in site format
                        } else {
                            profile = mapLinkedInToProfile(json);
                        }
                        mappedProfileCache = profile;
                        renderProfile(profile);
                        setStatus('Imported successfully. You can now download mapped profile.json.');
                    } catch (e) {
                        setStatus('Invalid JSON file.');
                    }
                };
                reader.readAsText(file);
            });

            downloadBtn.addEventListener('click', function(){
                if (!mappedProfileCache) { setStatus('Nothing to download. Import a JSON first.'); return; }
                const blob = new Blob([JSON.stringify(mappedProfileCache, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'profile.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setStatus('Downloaded profile.json.');
            });
        }; // end ssResumeUpload


   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssParallax();
        ssMoveHeader();
        ssMobileMenu();
        ssScrollSpy();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssSmoothScroll();
        ssBackToTop();
        ssResumeImport();
        ssResumeUpload();
        ssThemeToggle();

    })();

})(document.documentElement);